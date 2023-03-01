import db from '../../../../database/index';
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, DateOnlyDataType} from 'sequelize';
export interface atributosProjeto extends Model<InferAttributes<atributosProjeto>, InferCreationAttributes<atributosProjeto>>  {
    id: CreationOptional<number>;
    dataEntrega: DateOnlyDataType;
    nome: String;
    createdAt?: CreationOptional<DateOnlyDataType>;
    updatedAt?: CreationOptional<DateOnlyDataType>;
}

const Projeto = db.define<atributosProjeto>('Projeto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dataEntrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

/* db.sync({alter: true, force: false}).then(() => {
  console.log('Tabelas sincronizadas com sucesso.');
}).catch((error) => {
  console.error('Erro ao sincronizar as tabelas', error);
});
 */

export default Projeto;

