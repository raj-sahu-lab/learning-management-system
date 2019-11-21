module.exports = function (sequelize, DataTypes) {
  // userType 1 for bluejeans and 2 for Zoom user
  var TOA_live_classes = sequelize.define('TOA_live_classes', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    accountId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tutorId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    userType: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue : 1
    },
    liveClassUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    scheduleTime: {
      type: 'TIMESTAMP',
      allowNull: false
    },
    studentIds: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    agenda: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    delete: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    update_ip: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'TOA_live_classes'
  });

  TOA_live_classes.associate = function (model) {

    TOA_live_classes.belongsTo(model.TOA_account, { foreignKey: 'accountId', as: 'account' }),
    TOA_live_classes.belongsTo(model.TOA_tutor, { foreignKey: "tutorId", as: "tutor" })    
  };

  return TOA_live_classes;
};
