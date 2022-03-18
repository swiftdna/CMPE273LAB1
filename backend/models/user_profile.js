module.exports = function(sequelize, Sequelize) {
    const UserProfile = sequelize.define('user_profile', {
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
        name: {
            type: Sequelize.TEXT
        },
        dob: {
            type: Sequelize.DATEONLY
        },
        address1: {
            type: Sequelize.STRING
        },
        address2: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.TEXT
        },
        state: {
            type: Sequelize.TEXT
        },
        country: {
            type: Sequelize.TEXT
        },
        zipcode: {
            type: Sequelize.TEXT
        },
        dp_url: {
            type: Sequelize.STRING
        }
    });
    return UserProfile;
}