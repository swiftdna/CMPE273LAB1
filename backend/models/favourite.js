module.exports = function(sequelize, Sequelize) {
    const Favourite = sequelize.define('favourite', {
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
        item_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'products',
                key: 'id'
            }
        }
    });
    return Favourite;
}