import db from '../../../../database/index';
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes} from 'sequelize';
import Projeto from '../../Projetos/models/Projeto';
export interface atributosContrato extends Model<InferAttributes<atributosContrato>, InferCreationAttributes<atributosContrato>>  {
    id: CreationOptional<number>;
    titulo: string;
    nomeCliente: string;
    valor: number;
    dataContrato: Date;
    urlContrato: string;
    S3Chave: string;
    createdAt?: CreationOptional<Date>;
    updatedAt?: CreationOptional<Date>;
}

const Contrato = db.define<atributosContrato>('Contrato', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomeCliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  dataContrato: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  urlContrato: {
    type: DataTypes.STRING,
    allowNull: false
  },
  S3Chave: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Contrato.hasOne(Projeto, {
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

Projeto.belongsTo(Contrato, {
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

/* db.sync({alter: true, force: false}).then(() => {
  console.log('Tabelas sincronizadas com sucesso.');
}).catch((error) => {
  console.error('Erro ao sincronizar as tabelas', error);
}); */

export default Contrato;