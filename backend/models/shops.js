module.exports = function(sequelize, Sequelize) {
    const Shop = sequelize.define('shop', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        owner_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        name: {
            type: Sequelize.TEXT
        },
        image_url: {
            type: Sequelize.STRING
        }
    });
    return Shop;
}