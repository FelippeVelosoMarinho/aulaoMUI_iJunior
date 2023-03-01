import db from '../../../../database/index';
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, DateOnlyDataType} from 'sequelize';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';

export interface atributosUsuario extends Model<InferAttributes<atributosUsuario>, InferCreationAttributes<atributosUsuario>>  {
    id: CreationOptional<number>;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    dataNascimento: DateOnlyDataType;
    cargo: typeof cargosUsuario;
    tokenRecSenha: string;
    DataRecSenha: Date;
    urlFoto: string,
    S3Chave: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const Usuario = db.define<atributosUsuario>('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.ENUM ({
      values: [cargosUsuario.ADMIN, cargosUsuario.TRAINEE, cargosUsuario.USER, cargosUsuario.PENDENTE]
    }),
    defaultValue: cargosUsuario.PENDENTE,
    allowNull: false
  },
  tokenRecSenha: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DataRecSenha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  urlFoto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  S3Chave: {
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

export default Usuario;

