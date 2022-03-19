module.exports = function(sequelize, Sequelize) {
    const Order = sequelize.define('order', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        total: {
            type: Sequelize.DOUBLE
        },
        status: {
            type: Sequelize.TEXT
        }
    });
    return Order;
}