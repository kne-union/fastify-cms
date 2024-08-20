const fp = require('fastify-plugin');
const transform = require('lodash/transform');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;
  const { Op } = fastify.sequelize.Sequelize;

  const getList = async ({ objectCode, groupCode, status }) => {
    const queryFilter = {};

    if (Number.isInteger(status)) {
      queryFilter['status'] = status;
    }

    const objectModel = await models.object.findOne({
      where: { code: objectCode, groupCode }
    });
    if (!objectModel) {
      throw new Error('对象不存在');
    }

    const fieldList = await models.field.findAll({
      where: Object.assign({}, queryFilter, {
        objectCode,
        groupCode
      }),
      order: [['index', 'ASC']]
    });

    const referenceList = await models.reference.findAll({
      where: {
        originObjectCode: objectCode,
        groupCode
      }
    });

    const referenceMap = transform(
      referenceList,
      (result, item) => {
        result[item.fieldCode] = item.get({ plain: true });
      },
      {}
    );

    const referenceObjectList = await models.object.findAll({
      where: {
        groupCode,
        code: {
          [Op.in]: referenceList.map(item => item.targetObjectCode)
        }
      }
    });

    const referenceObjectMap = transform(
      referenceObjectList,
      (result, item) => {
        result[item.code] = item.get({ plain: true });
      },
      {}
    );

    return fieldList.map(item => {
      const field = item.get({ plain: true });
      return Object.assign(
        {},
        field,
        field.type === 'reference' && referenceMap[field.code]
          ? {
              reference: referenceMap[field.code],
              referenceObject: referenceObjectMap[referenceMap[field.code].targetObjectCode],
              referenceObjectCode: referenceMap[field.code].targetObjectCode,
              referenceFieldLabelCode: referenceMap[field.code].targetObjectFieldLabelCode,
              referenceType: referenceMap[field.code].type
            }
          : {}
      );
    });
  };

  const add = async ({ objectCode, groupCode, ...info }) => {
    const objectModel = await models.object.findOne({
      where: { code: objectCode, groupCode }
    });
    if (!objectModel) {
      throw new Error('对象不存在');
    }

    if (
      info['code'] &&
      (await models.field.count({
        where: { objectCode, groupCode, code: info['code'] }
      })) > 0
    ) {
      throw new Error(`该对象下${info['code']}字段已存在`);
    }

    const index = await models.field.count({
      where: { objectCode, groupCode }
    });

    const target = { objectCode, groupCode, index };
    ['name', 'code', 'description', 'fieldName', 'rule', 'type', 'isList', 'maxLength', 'minLength', 'formInputType', 'formInputProps', 'isBlock', 'isIndexed'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });

    if (info['type'] === 'reference' && info['referenceObjectCode']) {
      const targetObject = await models.object.findOne({
        where: { code: info['referenceObjectCode'], groupCode }
      });

      if (!targetObject) {
        throw new Error('关联对象不存在');
      }
      const t = await fastify.sequelize.instance.transaction();
      try {
        const field = await models.field.create(target, { transaction: t });
        await models.reference.create(
          {
            groupCode,
            originObjectCode: field.objectCode,
            fieldCode: field.code,
            targetObjectCode: targetObject.code,
            targetObjectFieldLabelCode: info['referenceFieldLabelCode'],
            type: info['referenceType']
          },
          { transaction: t }
        );
        await t.commit();
      } catch (e) {
        await t.rollback();
        throw e;
      }
    } else {
      await models.field.create(target);
    }
  };

  const remove = async ({ id }) => {
    const field = await models.field.findByPk(id);
    if (!field) {
      throw new Error('字段不存在');
    }

    if (!(await services.content.contentIsEmpty({ groupCode: field.groupCode, objectCode: field.objectCode }))) {
      throw new Error(`字段所在对象中已存在数据不允许删除，请处理好数据后重试`);
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      await models.reference.destroy({
        where: {
          groupCode: field.groupCode,
          originObjectCode: field.objectCode,
          fieldCode: field.code
        },
        transaction: t
      });
      await field.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const save = async ({ id, ...info }) => {
    const field = await models.field.findByPk(id);
    if (!field) {
      throw new Error('字段不存在');
    }
    ['name', 'description', 'rule', 'maxLength', 'minLength', 'formInputType', 'formInputProps', 'isBlock'].forEach(name => {
      if (info[name]) {
        field[name] = info[name];
      }
    });

    await field.save();
  };

  const close = async ({ id }) => {
    const field = await models.field.findByPk(id);
    if (!field) {
      throw new Error(`字段不存在，请刷新页面后重试`);
    }
    field.status = 10;
    await field.save();
  };

  const open = async ({ id }) => {
    const field = await models.field.findByPk(id);
    if (!field) {
      throw new Error(`字段不存在，请刷新页面后重试`);
    }
    field.status = 0;
    await field.save();
  };

  const moveUp = async ({ id }) => {
    const field = await models.field.findByPk(id);

    if (!field) {
      throw new Error('字段不存在');
    }

    const prevField = await models.field.findOne({
      where: {
        groupCode: field.groupCode,
        objectCode: field.objectCode,
        index: {
          [Op.lt]: field.index
        }
      },
      order: [['index', 'DESC']]
    });

    if (!prevField) {
      throw new Error('无法继续上移');
    }

    const currentIndex = field.index;
    field.index = prevField.index;
    prevField.index = currentIndex;
    const t = await fastify.sequelize.instance.transaction();
    try {
      await field.save({ transaction: t });
      await prevField.save({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const moveDown = async ({ id }) => {
    const field = await models.field.findByPk(id);

    if (!field) {
      throw new Error('字段不存在');
    }

    const nexField = await models.field.findOne({
      where: {
        groupCode: field.groupCode,
        objectCode: field.objectCode,
        index: {
          [Op.gt]: field.index
        }
      },
      order: [['index', 'ASC']]
    });

    if (!nexField) {
      throw new Error('无法继续下移');
    }

    const currentIndex = field.index;
    field.index = nexField.index;
    nexField.index = currentIndex;

    const t = await fastify.sequelize.instance.transaction();
    try {
      await field.save({ transaction: t });
      await nexField.save({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.cms.services.field = { getList, add, remove, save, close, open, moveUp, moveDown };
});
