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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '数据路径'
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
      type: {
        type: DataTypes.JSON,
        comment: '数据类型:jsonschema表示',
        allowNull: false
      },
      formInputType: {
        type: DataTypes.STRING,
        defaultValue: 'Input',
        comment: '表单输入组件类型'
      },
      formInputProps: {
        type: DataTypes.JSON,
        comment: '表单输入组件参数'
      },
      objectModelCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isIndex: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '该字段是否为索引字段'
      }
    },
    associate: ({ objectModel, objectField }) => {
      objectField.belongsTo(objectModel, {
        targetKey: 'code',
        foreignKey: 'objectModelCode'
      });
    },
    options: {
      indexed: [
        {
          unique: true,
          fields: ['code', 'object_model_code']
        }
      ]
    }
  };
};
