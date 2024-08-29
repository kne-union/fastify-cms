module.exports = ({ DataTypes }) => {
  return {
    model: {
      groupCode: {
        type: DataTypes.STRING
      },
      objectCode: {
        type: DataTypes.STRING
      },
      fieldCode: {
        type: DataTypes.STRING
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
          fields: ['field_code', 'object_code', 'group_code', 'content_id']
        },
        {
          name: 'indexed_value_key',
          fields: ['field_code', 'object_code', 'group_code', 'value']
        }
      ]
    }
  };
};
