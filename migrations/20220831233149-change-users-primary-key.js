'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`ALTER TABLE "_users" DROP CONSTRAINT "_users_pkey"`)
		await queryInterface.sequelize.query(`ALTER TABLE "_users" ADD PRIMARY KEY ("discordId")`)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`ALTER TABLE "_users" DROP CONSTRAINT "_users_pkey"`)
		await queryInterface.sequelize.query(`ALTER TABLE "_users" ADD PRIMARY KEY ("id")`)
	}
};
