module.exports = ({ DataTypes }) => {
  return {
    model: {
      groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '分组code'
      },
      fieldCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '关联字段code'
      },
      originObjectCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '关联对象code'
      },
      targetObjectCode: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '目标关联对象code'
      },
      targetObjectFieldLabelCode: {
        type: DataTypes.STRING,
        defaultValue: 'name',
        comment: '目标关联对象字段名称取值code，默认为name'
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'outer',
        comment: '引用方式:inner内部引用，outer外部引用'
      }
    },
    options: {
      indexed: [
        {
          unique: true,
          name: 'reference_unique_key',
          fields: ['field_code', 'object_code', 'group_code', 'deleted_at']
        },
        {
          name: 'reference_key',
          fields: ['object_code', 'group_code', 'deleted_at']
        }
      ]
    }
  };
};
