module.exports = function(sequelize, Sequelize) {
    const Category = sequelize.define('category', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        }
    });
    return Category;
}