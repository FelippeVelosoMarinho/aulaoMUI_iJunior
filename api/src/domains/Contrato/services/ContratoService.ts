import { atributosContrato } from '../models/Contrato';
import Contrato from '../models/Contrato';
import { ErroEnvioArquivo } from '../../../../errors/ErroEnvioArquivo';
import { ErroParametrosInvalidos } from '../../../../errors/ErroParametrosInvalidos';
import { ErroQuery } from '../../../../errors/ErroQuery';
import { deletarArquivoAWS } from '../../../middlewares/multer';
class ContratoService {
  async criar (arquivo: any,  body:atributosContrato) {

    if (arquivo == null) {
      throw new ErroEnvioArquivo ('Arquivo inexistente');
    }
    const {key: chave, location: url = ''} = arquivo;
    const {nomeCliente, valor, dataContrato, titulo} = body;

    const resultado = await Contrato.findOne({where: {titulo: titulo}});

    if (resultado != null) {
      deletarArquivoAWS(chave);
      throw new ErroParametrosInvalidos('Informe outro titulo para o contrato');
    }
    const contrato = {
      titulo: titulo,
      nomeCliente: nomeCliente,
      valor: valor,
      dataContrato: dataContrato,
      urlContrato: url,
      S3Chave: chave
    } as atributosContrato;

    await Contrato.create(contrato);
  }

  async listarOrdenado (atributo:string, ordem:string) {
    if (ordem != 'ASC' && ordem != 'DESC') {
      throw new ErroParametrosInvalidos ('Tipo de ordem invalida');
    }
    if (atributo != 'nomeCliente' && atributo != 'titulo' && atributo != 'valor') {
      throw new ErroParametrosInvalidos ('Atributo a ser ordenado inválido');
    }
    const resultado = await Contrato.findAll({
      order: [[atributo, ordem]]
    });
    if (resultado == null) {
      throw new ErroQuery ('Não existem contratos cadastrados no sistema');
    }
    return resultado;
  }

  async deletar (idContrato:string) {
    const resultado = await Contrato.findByPk(idContrato);
    if (resultado == null) {
      throw new ErroQuery ('Não existe esse contrato a ser deletado');
    }
    await Contrato.destroy({where: {id: idContrato}});
    await deletarArquivoAWS(resultado.S3Chave);
  }

  async getContrato (idListagem:number) {
    const resultado = await Contrato.findOne({ where: { id: idListagem }});
    if (resultado == null) {
      throw new ErroQuery ('Não existe contrato com esse id');
    }
    return resultado;
  }

  async editar (idListagem:number, body:atributosContrato, arquivo:any) {
    const resultado = await Contrato.findOne({ where: { id: idListagem }});
    if (resultado == null) {
      throw new ErroQuery ('Não existe contrato com esse id');
    }
    const pesquisaContrato = await Contrato.findOne({where: {titulo: body.titulo}});
    if (pesquisaContrato != null && pesquisaContrato.id != idListagem) {
      throw new ErroParametrosInvalidos('Informe outro titulo para o contrato');
    }
    if (arquivo != null) {
      const {key: chave, location: url = ''} = arquivo;
      await deletarArquivoAWS(resultado.S3Chave);
      body.urlContrato = url;
      body.S3Chave = chave;
    }
    await resultado.update(body);
  }
}

export default new ContratoService();