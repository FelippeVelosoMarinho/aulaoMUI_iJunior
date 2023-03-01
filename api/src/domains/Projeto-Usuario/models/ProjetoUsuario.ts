import db from '../../../../database/index';
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes} from 'sequelize';
import Projeto from '../../Projetos/models/Projeto';
import Usuario from '../../Usuario/models/Usuario';


export interface atributosProjetoUsuario
 extends Model<InferAttributes<atributosProjetoUsuario>, InferCreationAttributes<atributosProjetoUsuario>>  {
    id: CreationOptional<number>;
    createdAt?: CreationOptional<Date>;
    updatedAt?: CreationOptional<Date>;
 }

const ProjetoUsuario = db.define<atributosProjetoUsuario>('ProjetoUsuario', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
});

Projeto.belongsToMany(Usuario, {
  through: {
    model: ProjetoUsuario,
  },
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

Usuario.belongsToMany(Projeto, {
  through: {
    model: ProjetoUsuario,
  },
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

Projeto.hasMany(ProjetoUsuario);
ProjetoUsuario.belongsTo(Projeto);
Usuario.hasMany(ProjetoUsuario);
ProjetoUsuario.belongsTo(Usuario);



export default ProjetoUsuario;