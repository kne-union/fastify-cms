module.exports = ({ DataTypes }) => {
  return {
    model: {
      groupCode: {
        type: DataTypes.STRING
      },
      objectCode: {
        type: DataTypes.STRING
      },
      fieldName: {
        type: DataTypes.STRING,
        comment: '数据取值路径'
      },
      value: {
        type: DataTypes.JSON
      },
      contentId: {
        type: DataTypes.INTEGER
      }
    },
    options: {
      paranoid: false,
      indexed: [
        {
          name: 'indexed_unique_key',
          fields: ['field_name', 'object_code', 'group_code', 'content_id']
        },
        {
          name: 'indexed_value_key',
          fields: ['field_name', 'object_code', 'group_code', 'value']
        }
      ]
    }
  };
};
