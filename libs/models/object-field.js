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
      fieldName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '表单字段name'
      },
      name: {
        type: DataTypes.STRING,
        comment: '名称，作为表单字段label',
        allowNull: false
      },
      rule: {
        type: DataTypes.STRING,
        comment: '表单验证规则作为表单字段rule'
      },
      index: {
        type: DataTypes.INTEGER,
        comment: '字段排序'
      },
      parentCode: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '默认为空，可以关联当前对象的其他字段code'
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
      isIndexed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '该字段是否为索引字段'
      }
    },
    associate: ({ objectModel, objectField }) => {
      objectField.belongsTo(objectModel, {
        targetKey: 'code',
        foreignKey: 'objectModelCode',
        constraints: false
      });
    },
    options: {
      indexed: [
        {
          unique: true,
          fields: ['code', 'object_model_code']
        },
        {
          fields: ['object_model_code']
        },
        {
          fields: ['parent_code']
        }
      ]
    }
  };
};
