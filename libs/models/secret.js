module.exports = ({ DataTypes }) => {
  return {
    model: {
      value: {
        type: DataTypes.STRING,
        comment: '密钥内容'
      },
      fieldName: {
        type: DataTypes.STRING,
        comment: '密钥字段name'
      }
    },
    associate: ({ secret, content }) => {
      secret.belongsTo(content, { foreignKey: 'contentId' });
    }
  };
};
