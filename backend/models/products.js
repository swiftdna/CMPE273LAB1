module.exports = function(sequelize, Sequelize) {
    const Product = sequelize.define('product', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        shop_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'shops',
                key: 'id'
            }
        },
        name: {
            type: Sequelize.TEXT
        },
        photo_url: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DOUBLE
        },
        qty: {
            type: Sequelize.INTEGER
        }
    });
    return Product;
}