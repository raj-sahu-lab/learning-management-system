
module.exports = function(sequelize, DataTypes) {
    var TOA_set = sequelize.define('TOA_set', {
      set_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      subject_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      topic_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      content_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      set_title: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      set_instruction: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
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
      tableName: 'TOA_set'
    });
  
    TOA_set.associate = function(model){
  
        TOA_set.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
        TOA_set.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id', as: 'subject'}),
        TOA_set.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id', as: 'topic'}), 
        TOA_set.belongsTo(model.TOA_content,  {foreignKey: 'content_id', as: 'content'})      
    };
  
  
    return TOA_set;
  };
  