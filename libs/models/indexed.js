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
      type: {
        type: DataTypes.STRING
      },
      contentId: {
        type: DataTypes.INTEGER
      }
    },
    options: {
      indexed: [
        {
          unique: true,
          name: 'indexed_unique_key',
          fields: ['field_code', 'object_code', 'group_code', 'content_id', 'deleted_at']
        },
        {
          name: 'indexed_value_key',
          fields: ['field_code', 'object_code', 'group_code', 'value', 'deleted_at']
        }
      ]
    }
  };
};
