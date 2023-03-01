import { ErroParametrosInvalidos } from '../../../../errors/ErroParametrosInvalidos';
import { ErroQuery } from '../../../../errors/ErroQuery';
import ProjetoUsuario from '../../Projeto-Usuario/models/ProjetoUsuario';
import Projeto, { atributosProjeto } from '../models/Projeto';
import Usuario from '../../Usuario/models/Usuario';

class ProjetoService {

  async adicionarVariosUsuarios(body: any, projetoAtual: atributosProjeto) {

    body.UsuarioId.forEach( async (usuarioBody:any) => {
      const usuario = await Usuario.findByPk(usuarioBody);

      if (usuario == null) {
        throw new ErroQuery('Projeto ou usuário não encontrado');
      }

      const projetoUsuario = {
        UsuarioId: usuarioBody,
        ProjetoId: projetoAtual.id,
      };
      await ProjetoUsuario.create(projetoUsuario);
    });
  }

  async criarProjeto(body: any){

    if (body.UsuarioId == null) {
      throw new ErroParametrosInvalidos('É necessário adicionar usuarios ao projeto');
    }

    const projeto = {
      dataEntrega: body.dataEntrega,
      nome: body.nome,
      ContratoId: body.ContratoId
    };
    const projetoAtual = await Projeto.create(projeto);


    if ( !body.UsuarioId.forEach) { //caso adicione somente um usuario ao projeto
      const projetoUsuario = {
        UsuarioId: body.UsuarioId,
        ProjetoId: projetoAtual.id,
      };
      await ProjetoUsuario.create(projetoUsuario);
      return;
    }

    await this.adicionarVariosUsuarios(body, projetoAtual);

  }

  async editar(id: number, body: any){
    const projeto = await Projeto.findByPk(id);
    if(!projeto){
      throw new ErroQuery('Projeto não encontrado');
    }
    await this.adicionarVariosUsuarios(body, projeto);
    await projeto.update(body);
  }

  async deletar(id: number){
    const projeto = await Projeto.findByPk(id);
    if(!projeto){
      throw new ErroQuery('Projeto não encontrado');
    }
    await projeto.destroy();
  }

  async getProjeto(idProjeto:string) {
    const projeto = await Projeto.findByPk(idProjeto, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [{
        model: Usuario,
        attributes: ['nome', 'id'],
        through: {
          attributes: [],
        }
      }]
    });

    if (projeto == null) {
      throw new ErroQuery('Projeto não encontrado');
    }
    return projeto;
  }

  async listarOrdenado(atributo:string, ordem:string) {
    if (ordem != 'ASC' && ordem != 'DESC') {
      throw new ErroParametrosInvalidos ('Tipo de ordem invalida');
    }
    if (atributo != 'nome') {
      throw new ErroParametrosInvalidos ('Atributo a ser ordenado inválido');
    }
    const resultado = await Projeto.findAll({
      order: [[atributo, ordem]]
    });
    if (resultado == null) {
      throw new ErroQuery ('Projeto não encontrado');
    }
    return resultado;
  }

  async adicionarUsuario(idProjeto: string, idUsuario: string) {
    const projeto = await Projeto.findByPk(+idProjeto);
    const usuario = await Usuario.findByPk(+idUsuario);
    if (projeto == null || usuario == null) {
      throw new ErroQuery('Projeto ou usuário não encontrado');
    }
    const projetoUsuario= {
      UsuarioId: idUsuario,
      ProjetoId: idProjeto
    };
    await ProjetoUsuario.create(projetoUsuario);
  }

  async removerUsuario(idProjeto: string, idUsuario: string) {
    const projeto = await Projeto.findByPk(+idProjeto);
    const usuario = await Usuario.findByPk(+idUsuario);
    if (projeto == null || usuario == null) {
      throw new ErroQuery('Projeto ou usuário não encontrado');
    }

    const projetoUsuario= {
      UsuarioId: idUsuario,
      ProjetoId: idProjeto
    };
    const usuarioDeletar = await ProjetoUsuario.findOne({
      where: projetoUsuario
    });
    if (usuarioDeletar == null) {
      throw new ErroQuery('Projeto ou usuário não encontrado');
    }
    await usuarioDeletar.destroy();
  }
}
export default new ProjetoService();