module.exports = ({ DataTypes }) => {
  return {
    model: {
      data: {
        type: DataTypes.JSON,
        comment: '内容数据'
      },
      groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '对象集合code'
      },
      objectCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '对象code'
      }
    },
    options: {
      indexed: [
        {
          fields: ['group_code', 'object_code', 'deleted_at']
        }
      ]
    }
  };
};
