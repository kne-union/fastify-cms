const fp = require('fastify-plugin');
const transform = require('lodash/transform');
const get = require('lodash/get');
const isNil = require('lodash/isNil');
const groupBy = require('lodash/groupBy');
const set = require('lodash/set');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;
  const { Op } = fastify.sequelize.Sequelize;
  //当对象没有数据时才允许修改
  const contentIsEmpty = async ({ groupCode, objectCode }) => {
    const queryFilter = {};
    if (groupCode) {
      queryFilter['groupCode'] = groupCode;
    }
    if (objectCode) {
      queryFilter['objectCode'] = objectCode;
    }
    return (
      (await models.content.count({
        where: Object.assign({}, queryFilter)
      })) === 0
    );
  };

  const add = async ({ data, groupCode, objectCode }) => {
    const { object, fields } = await services.object.getMetaInfo({ groupCode, objectCode });
    const indexedFields = fields.filter(item => item.isIndexed === true);
    //todo: 这里需要对数据进行验证
    const t = await fastify.sequelize.instance.transaction();
    try {
      const content = await models.content.create(
        {
          data,
          groupCode,
          objectCode
        },
        { transaction: t }
      );
      if (indexedFields.length > 0) {
        await models.indexed.bulkCreate(
          indexedFields
            .filter(item => {
              return get(data, item.fieldName) !== void 0;
            })
            .map(item => {
              return {
                groupCode,
                objectCode,
                fieldCode: item.code,
                value: get(data, item.fieldName),
                contentId: content.id
              };
            }),
          { transaction: t }
        );
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const save = async ({ data }) => {
    const content = await models.content.findByPk(data.id);
    if (!content) {
      throw new Error('内容数据不存在');
    }
    const { groupCode, objectCode } = content;
    const { object, fields } = await services.object.getMetaInfo({ groupCode, objectCode });
    const indexedFields = fields.filter(item => item.isIndexed === true);

    //todo: 这里需要对数据进行验证
    const t = await fastify.sequelize.instance.transaction();
    try {
      const targetData = Object.assign({}, content.data);
      fields
        .filter(item => {
          return get(data, item.fieldName) !== void 0;
        })
        .forEach(item => {
          set(targetData, item.fieldName, get(data, item.fieldName));
        });
      content.data = targetData;
      await content.save({ transaction: t });

      //重建字段索引
      await models.indexed.destroy({
        where: {
          contentId: content.id,
          groupCode,
          objectCode
        },
        transaction: t
      });

      if (indexedFields.length > 0) {
        await models.indexed.bulkCreate(
          indexedFields
            .filter(item => {
              return get(data, item.fieldName) !== void 0;
            })
            .map(item => {
              return {
                groupCode,
                objectCode,
                fieldCode: item.code,
                value: get(data, item.fieldName),
                contentId: content.id
              };
            }),
          { transaction: t }
        );
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getList = async ({ groupCode, objectCode, filter, perPage = 20, currentPage = 1 }) => {
    const { object, fields, references } = await services.object.getMetaInfo({ groupCode, objectCode });
    const fieldMap = transform(
      fields,
      (result, value) => {
        result[value.code] = value;
      },
      {}
    );
    const { count, rows } = await (async filter => {
      if (filter) {
        //如果存在索引筛选
        const filterQuery = [];
        Object.keys(filter).forEach(fieldCode => {
          const field = fieldMap[fieldCode];
          if (!(field && field.isIndexed)) {
            return;
          }
          if (field.type === 'string' || field.type === 'phone') {
            filterQuery.push({
              groupCode,
              objectCode,
              fieldCode,
              value: {
                [Op.like]: `%${filter[fieldCode]}%`
              }
            });
            return;
          }
          if (field.type === 'boolean') {
            filterQuery.push({
              groupCode,
              objectCode,
              fieldCode,
              value: filter[fieldCode]
            });
            return;
          }

          if (['number'].indexOf(field.type) > -1) {
            const targetQuery = {};
            if (!isNil(filter[fieldCode][0])) {
              targetQuery[Op.gt] = parseInt(filter[fieldCode][0]);
            }
            if (!isNil(filter[fieldCode][1])) {
              targetQuery[Op.lt] = parseInt(filter[fieldCode][1]);
            }
            filterQuery.push({
              groupCode,
              objectCode,
              fieldCode,
              value: targetQuery
            });
            return;
          }

          if (['date', 'datetime'].indexOf(field.type) > -1) {
            filterQuery.push({
              groupCode,
              objectCode,
              fieldCode,
              value: {
                [Op.gt]: filter[fieldCode].value[0],
                [Op.lt]: filter[fieldCode].value[1]
              }
            });
            return;
          }

          if ((field.type === 'reference' && field.referenceType !== 'inner') || field.type === 'city' || field.type === 'industry') {
            filterQuery.push({
              groupCode,
              objectCode,
              fieldCode,
              value: {
                [Op.or]: filter[fieldCode].map(id => parseInt(id))
              }
            });
          }
        });

        if (filterQuery.length > 0) {
          const count = await models.indexed.count({
            attributes: ['contentId'],
            where: {
              [Op.and]: filterQuery
            },
            group: 'contentId',
            offset: perPage * (currentPage - 1),
            limit: perPage
          });
          const rows = await models.indexed.findAll({
            attributes: ['contentId'],
            where: {
              [Op.and]: filterQuery
            },
            group: 'contentId',
            offset: perPage * (currentPage - 1),
            limit: perPage
          });
          if (count === 0) {
            return { count, rows };
          }

          const data = await models.content.findAll({
            where: {
              id: {
                [Op.in]: rows.map(({ contentId }) => contentId)
              }
            }
          });
          return { count, rows: data };
        }
      }

      return await models.content.findAndCountAll({
        where: {
          groupCode,
          objectCode
        },
        offset: perPage * (currentPage - 1),
        limit: perPage
      });
    })(filter);
    //查询关联对象数据
    const referenceQuery = [];
    references
      .filter(({ type }) => type === 'outer')
      .forEach(({ fieldCode }) => {
        const { fieldName } = fieldMap[fieldCode];
        referenceQuery.push(...rows.map(({ data }) => get(data, fieldName)));
      });

    const referenceContents = await models.content.findAll({
      where: {
        id: {
          [Op.in]: referenceQuery
        }
      }
    });

    return {
      object,
      fields,
      references,
      referenceContents: transform(
        groupBy(referenceContents, 'objectCode'),
        (result, item, key) => {
          result[key] = item.map(content =>
            Object.assign({}, content.data, {
              id: content.id,
              createdAt: content.createdAt,
              updatedAt: content.updatedAt
            })
          );
        },
        {}
      ),
      pageData: rows.map(item => {
        return Object.assign({}, item.data, { id: item.id, createdAt: item.createdAt, updatedAt: item.updatedAt });
      }),
      totalCount: count
    };
  };

  const getDetail = async ({ id }) => {
    const content = await models.content.findByPk(id);

    if (!content) {
      throw new Error('数据不存在');
    }

    const { groupCode, objectCode } = content;

    const { object, fields, references } = await services.object.getMetaInfo({ groupCode, objectCode });

    return {
      object,
      fields,
      references,
      data: content.data
    };
  };

  const remove = async ({ id }) => {
    const content = await models.content.findByPk(id);

    if (!content) {
      throw new Error('数据不存在');
    }

    if (
      (await models.indexed.count({
        where: {
          value: content.id,
          groupCode: content.groupCode,
          objectCode: content.objectCode
        }
      })) > 0
    ) {
      throw new Error('该数据已经被其他数据关联使用不能删除');
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      await content.destroy({ transaction: t });
      await models.indexed.destroy({
        where: {
          contentId: content.id,
          groupCode: content.groupCode,
          objectCode: content.objectCode
        },
        transaction: t
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.cms.services.content = { contentIsEmpty, add, save, getList, getDetail, remove };
});
