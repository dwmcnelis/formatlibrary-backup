'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('_users',
			{
				id: {
					type: Sequelize.DataTypes.CHAR,
					length: 32,
					allowNull: false,
					primaryKey: true
				},
				discordId: {
					type: Sequelize.DataTypes.CHAR,
					length: 32,
					allowNull: true
				},
				email: {
					type: Sequelize.DataTypes.CHAR,
					length: 255,
					allowNull: false
				},
				username: {
					type: Sequelize.DataTypes.CHAR,
					length: 255,
					allowNull: true
				},
				name: {
					type: Sequelize.DataTypes.CHAR,
					length: 255,
					allowNull: true
				},
				firstName: {
					type: Sequelize.DataTypes.CHAR,
					length: 255,
					allowNull: true
				},
				lastName: {
					type: Sequelize.DataTypes.CHAR,
					length: 255,
					allowNull: true
				},
				createdAt: {
					type: Sequelize.DataTypes.DATE
				},
				updatedAt: {
					type: Sequelize.DataTypes.DATE
				}
			})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('_users');
	}
};
