module.exports = function(sequelize, Sequelize) {
    const OrderDetail = sequelize.define('order_detail', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        order_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        item_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        qty: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.DOUBLE
        }
    });
    return OrderDetail;
}