module.exports = function (sequelize, DataTypes) {
    var TOA_student_purchase_detail = sequelize.define('TOA_student_purchase_detail', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        purchase_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        gateway_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        iosPaymentGateWayid: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        offer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        offer_code: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        offer_discount: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        transaction_id: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        payment_response: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        currencyId:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 1
        },
        amount: {
            type: DataTypes.FLOAT(11),
            allowNull: false
        },
        create_ip: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'TOA_student_purchase_detail'
    });

    TOA_student_purchase_detail.associate = function (model) {

        TOA_student_purchase_detail.belongsTo(model.TOA_student_purchase, { foreignKey: 'purchase_id', as: 'purchase' }),
        TOA_student_purchase_detail.belongsTo(model.TOA_paymentgateway,  {foreignKey: 'gateway_id' , as: 'payment_type'}),
        TOA_student_purchase_detail.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
        TOA_student_purchase_detail.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' })
    };

    return TOA_student_purchase_detail;
};
