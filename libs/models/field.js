module.exports = ({ DataTypes }) => {
  return {
    model: {
      code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        comment: '唯一标识，默认为UUIDV4自动生成'
      },
      objectCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '对象code'
      },
      groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '对象集合code'
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
      description: {
        type: DataTypes.TEXT,
        comment: '描述'
      },
      type: {
        type: DataTypes.JSON,
        comment: 'number,string,boolean,reference',
        allowNull: false
      },
      isList: {
        type: DataTypes.BOOLEAN,
        comment: '是否为列表',
        defaultValue: false,
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
      isIndexed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '该字段是否为索引字段'
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '0:正常,10:关闭'
      }
    },
    options: {
      indexed: [
        {
          unique: true,
          name: 'field_unique_key',
          fields: ['code', 'object_code', 'group_code', 'deleted_at']
        },
        {
          name: 'field_status_key',
          fields: ['object_code', 'group_code', 'status', 'deleted_at']
        },
        {
          name: 'field_key',
          fields: ['object_code', 'group_code', 'deleted_at']
        }
      ]
    }
  };
};
