module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
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
      objectGroupCode: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    associate: ({ objectModel, objectGroup, objectField }) => {
      objectModel.belongsTo(objectGroup, {
        targetKey: 'code',
        foreignKey: 'objectGroupCode',
        constraints: false
      });
      objectModel.hasMany(objectField, {
        sourceKey: 'code',
        foreignKey: 'objectModelCode',
        constraints: false
      });
    },
    options: {
      indexed: [
        {
          unique: true,
          fields: ['code', 'object_group_code', 'delete_at']
        },
        {
          fields: ['object_group_code']
        }
      ]
    }
  };
};
