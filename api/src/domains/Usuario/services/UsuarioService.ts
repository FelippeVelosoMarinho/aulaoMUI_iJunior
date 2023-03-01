import { atributosUsuario } from '../models/Usuario';
import Usuario from '../models/Usuario';
import { hash } from 'bcrypt';
import { PayloadParams } from '../types/PayLoadParams';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';
import { ErroParametrosInvalidos } from '../../../../errors/ErroParametrosInvalidos';
import { ErroQuery } from '../../../../errors/ErroQuery';
import { ErroPermissao } from '../../../../errors/ErroPermissao';
import {Op} from 'sequelize';
import { ErroEnvioArquivo } from '../../../../errors/ErroEnvioArquivo';
import { deletarArquivoAWS } from '../../../middlewares/multer';

class UserService {

  async verificaToken (email: string, token: string){
    const usuario = await this.listarPeloEmail(email);
    const dataAgora = new Date();
    if((usuario.tokenRecSenha !== token) || (dataAgora > usuario.DataRecSenha)){
      throw new ErroParametrosInvalidos('Token Inválido');
    }
    return;
  }

  async adicionaToken(token:string, data:Date, email:string){
    const usuario = await this.listarPeloEmail(email);
    await usuario.update({tokenRecSenha: token, DataRecSenha: data});
  }

  async encriptarSenha(password: string) {
    const saltRounds = 10;
    return await hash(password, saltRounds);
  }

  async atualizarSenha(senha:string, email: string){
    const usuario = await this.listarPeloEmail(email);
    const novaSenha = await this.encriptarSenha(senha);
    await usuario.update({senha: novaSenha});
  }

  async atualizarUsuario(id:number, body: atributosUsuario, usuarioLogado: PayloadParams, foto: any){
    const usuario = await this.listarPeloId(id);

    if (usuarioLogado.cargo.toString() != cargosUsuario.ADMIN && usuarioLogado.id != id) {
      throw new ErroPermissao('Você não tem permissão para editar outro usuário!');
    }
    if (body.cargo && usuarioLogado.cargo.toString() != cargosUsuario.ADMIN) {
      throw new ErroPermissao('Você não tem permissão para editar seu cargo');
    }
    if (body.senha) {
      body.senha = await this.encriptarSenha(body.senha);
    }
    if (foto != null) {
      const {key: chave, location: url = ''} = foto;
      await deletarArquivoAWS(usuario.S3Chave);
      body.urlFoto = url;
      body.S3Chave = chave;
    }
    await usuario.update(body);
  }

  async cadastrar(body:atributosUsuario, foto: any){

    if (foto == null) {
      throw new ErroEnvioArquivo ('Foto inexistente');
    }
    const usuarioBody = body;
    const {key: chave, location: url = ''} = foto;

    const resultado = await Usuario.findOne({where: {email: usuarioBody.email}});

    if (resultado != null) {
      deletarArquivoAWS(chave);
      throw new ErroParametrosInvalidos('Informe outro email para o usuario');
    }
    usuarioBody.senha = await this.encriptarSenha(usuarioBody.senha);

    const usuario = {
      nome: usuarioBody.nome,
      email: usuarioBody.email,
      senha: usuarioBody.senha,
      telefone: usuarioBody.telefone,
      dataNascimento: usuarioBody.dataNascimento,
      cargo: usuarioBody.cargo,
      urlFoto: url,
      S3Chave: chave
    } as atributosUsuario;

    await Usuario.create(usuario);
  }

  async perfilUsuario (idUsuario:string, cargo:string, idListagem:string) {

    if (idUsuario != idListagem && cargo != 'admin') {
      throw new ErroPermissao('Você não possui permissão para ver as informações de outro usuário');
    }

    const resultado = await Usuario.findOne({ where: { id: idListagem }});

    if (resultado == null) {
      throw new ErroQuery ('Não existe usuario com esse id');
    }
    return resultado;
  }

  async listarOrdenado (atributo:string, ordem:string) {
    if (ordem != 'ASC' && ordem != 'DESC') {
      throw new ErroParametrosInvalidos ('Tipo de ordem invalida');
    }
    if (atributo != 'nome' && atributo != 'email') {
      throw new ErroParametrosInvalidos ('Atributo a ser ordenado inválido');
    }
    const pendentes = await Usuario.findAll({
      order: [[atributo, ordem]],
      where: {cargo: cargosUsuario.PENDENTE}
    });
    const resultado = await Usuario.findAll({
      order: [[atributo, ordem]],
      where: {cargo: {[Op.ne]: cargosUsuario.PENDENTE}}
    });
    if (resultado == null) {
      throw new ErroQuery ('Não existem usuários cadastrados no sistema');
    }
    return pendentes.concat(resultado);
  }

  async deletar (id:number) {
    const usuario = await Usuario.findOne({where: {id: id}});
    if (usuario == null) {
      throw new ErroQuery ('Não existe esse usuario a ser deletado');
    }
    await Usuario.destroy({where: {id: id}});
  }

  async listarPeloId(id: number) {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      throw new ErroQuery('Não há um usuário com o ID informado');
    }
    return usuario;
  }

  async listarPeloEmail (emailUsuario: string) {
    const resultado = await Usuario.findOne({ where: { email: emailUsuario }});
    if (resultado == null) {
      throw new ErroQuery ('Email não cadastrado!');
    }
    return resultado;
  }
}

export default new UserService();