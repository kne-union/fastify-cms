module.exports = ({ DataTypes }) => {
  return {
    model: {
      code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        comment: '唯一标识，默认为UUIDV4自动生成'
      },
      name: {
        type: DataTypes.STRING,
        comment: '名称',
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        comment: '描述'
      },
      status: {
        type: DataTypes.INTEGER,
        comment: '0:正常,10:关闭'
      }
    },
    associate: ({ objectGroup, objectModel }) => {
      objectGroup.hasMany(objectModel, {
        sourceKey: 'code',
        foreignKey: 'objectGroupCode',
        constraints: false
      });
    },
    options: {
      indexed: [
        {
          unique: true,
          fields: ['code']
        }
      ]
    }
  };
};
