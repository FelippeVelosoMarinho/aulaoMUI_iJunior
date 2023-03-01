import ProjetoUsuario from '../models/ProjetoUsuario';

class ProjetoUsuarioService {
  async criarProjetoUsuario(body: any) {
    const projetoUsuario = {
      UsuarioId: body.UsuarioId,
      ProjetoId: body.ProjetoId,
    };
    await ProjetoUsuario.create(projetoUsuario);
  }
  async acharTudo(id:number) {
    const projetoUsuario = await ProjetoUsuario.findAll({
      where: {
        ProjetoId: id
      }
    });
    return projetoUsuario;
  }

}

export default new ProjetoUsuarioService();