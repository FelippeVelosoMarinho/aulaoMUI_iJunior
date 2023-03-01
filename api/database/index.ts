import { Sequelize } from 'sequelize';

const db = new Sequelize(
  {
    logging: false, //^desabilita o log de queries
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

  });


db.authenticate().then(() => {
  console.log('Conexão estabelecida com sucesso no banco de dados.');
}).catch((error) => {
  console.error('Erro ao conectar ao banco de dados', error);
});


export default db;