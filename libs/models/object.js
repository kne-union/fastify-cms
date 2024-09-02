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
      type: {
        type: DataTypes.STRING,
        defaultValue: 'outer',
        comment: 'inner:内部对象，client不展示 outer:正常对象client展示'
      },
      isSingle: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '该对象是否为单例模式'
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '排序索引'
      },
      tag: {
        type: DataTypes.STRING,
        comment: '对象分类，可以在某些业务中用于对象分类筛选条件'
      },
      description: {
        type: DataTypes.TEXT,
        comment: '描述'
      },
      groupCode: {
        type: DataTypes.STRING,
        allowNull: false
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
          name: 'object_unique_key',
          fields: ['code', 'group_code', 'deleted_at']
        },
        {
          name: 'object_status_key',
          fields: ['group_code', 'status', 'deleted_at']
        },
        {
          name: 'object_key',
          fields: ['group_code', 'deleted_at']
        }
      ]
    }
  };
};
