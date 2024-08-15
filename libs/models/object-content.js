const transform = require('lodash/transform');
module.exports = ({ DataTypes }) => {
  const indexedFields = Array.from({ length: 10 }, (_, index) => index).map(index => {
    return {
      fieldName: `fieldIndex${index + 1}`,
      indexName: `field_index${index + 1}`
    };
  });
  return {
    model: Object.assign(
      {},
      {
        content: {
          type: DataTypes.JSON,
          comment: '内容'
        },
        modelType: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '为object-model的code'
        }
      },
      transform(
        indexedFields,
        (result, { fieldName }) => {
          result[fieldName] = {
            type: DataTypes.STRING,
            comment: '预留索引字段，方便进行搜索'
          };
        },
        {}
      )
    ),
    associate: ({ objectContent, objectModel }) => {
      objectContent.belongsTo(objectModel, {
        targetKey: 'code',
        foreignKey: 'modelType',
        constraints: false
      });
    },
    options: {
      indexed: [
        ...indexedFields.map(({ indexName }) => {
          return {
            fields: [indexName]
          };
        }),
        {
          fields: ['model_type']
        }
      ]
    }
  };
};
