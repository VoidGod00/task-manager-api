const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASSWORD,{
        host : process.env.PG_HOST || 'localhost',
        port : process.env.PG_PORT || 5432,
        dialect : 'postgres',
        logging : false,
    }
);

async function connectPostgres(){
    await sequelize.authenticate();
    await sequelize.sync({alter : true});
    console.log('PostgreSQL connected');
}

module.exports = {sequelize, connectPostgres};