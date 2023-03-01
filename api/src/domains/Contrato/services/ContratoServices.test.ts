import ContratoService from './ContratoService';
import Contrato, { atributosContrato } from '../models/Contrato';
import { ErroParametrosInvalidos } from '../../../../errors/ErroParametrosInvalidos';


jest.mock('../../../middlewares/multer', () => {
  return {
    deletarArquivoAWS: jest.fn(),
    s3Config: jest.fn(),
    multerConfig: jest.fn(),
  };
});

jest.mock('../models/Contrato', () => {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
});

describe('Teste de criar contrato', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Deve criar um contrato', async () => {

    const arquivo = {
      urlContrato: 'urlContrato',
      S3Chave: 'S3Chave',
    };

    const contratoTeste = {
      id: 1,
      titulo: 'Teste',
      nomeCliente: 'nomeCliente',
      valor: 10.01,
      dataContrato: new Date(),

    } as atributosContrato;

    (Contrato.create as jest.MockedFunction<typeof Contrato.create>).mockImplementation (
      () => {
        return {};
      });

    await ContratoService.criar(arquivo, contratoTeste);

    expect(Contrato.create).toHaveBeenCalledTimes(1);
  });
});

describe('Teste de listar ordenado', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const contratoTeste = {
    id: 1,
    titulo: 'Teste',
    nomeCliente: 'nomeCliente',
    valor: 10.01,
    dataContrato: new Date(),
    urlContrato: 'urlContrato',
    S3Chave: 'S3Chave',
  } as atributosContrato;

  test('Deve listar todos os contratos ordenado', async () => {

    (Contrato.findAll as jest.MockedFunction<typeof Contrato.findAll>).mockImplementation(() => Promise.resolve([contratoTeste]));

    await ContratoService.listarOrdenado('titulo', 'ASC');

    expect(Contrato.findAll).toHaveBeenCalledTimes(1);
  });

  test('Atributo de ordenação inválido ==> lança uma exceção', async () => {
    return expect(async () => {
      await ContratoService.listarOrdenado('chiconiconi', 'ASC'); })
      .rejects.toThrow(new ErroParametrosInvalidos('Atributo a ser ordenado inválido'));
  });

  test ('Tipo de ordem invalida ==> lança uma exceção', async () => {
    return expect(async () => {
      await ContratoService.listarOrdenado('nomeCliente', 'viceVersa'); })
      .rejects.toThrow(new ErroParametrosInvalidos('Tipo de ordem invalida'));
  });
});

/* jest.mock('../../../middlewares/multer');
describe('Teste de atualização de contrato', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Deve atualizar um contrato', async () => {

    const foto = {
      urlContrato: 'urlContrato',
      s3Chave: 's3Chave',
    };

    const contratoTeste = {
      id: 1,
      titulo: 'Teste',
      nomeCliente: 'nomeCliente',
      valor: 10.01,
      dataContrato: new Date(),
      urlContrato: 'urlContrato',
    } as atributosContrato;

    (Contrato.findOne as jest.MockedFunction<typeof Contrato.findOne>).mockImplementation(() => Promise.resolve(contratoTeste));
    await ContratoService.editar(contratoTeste.id, contratoTeste, foto);

    expect(ContratoService.editar).toHaveBeenCalledTimes(1);
  });
}); */

jest.mock('../../../middlewares/multer');
describe('Teste deletar contrato', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Deve deletar um contrato', async () => {
    const contratoTeste = {
      id: 1,
      titulo: 'Teste',
      nomeCliente: 'nomeCliente',
      valor: 10.01,
      dataContrato: new Date(),
      urlContrato: 'urlContrato',
      S3Chave: 'S3Chave',
    } as atributosContrato;

    (Contrato.findByPk as jest.MockedFunction<typeof Contrato.findByPk>).mockImplementation(() => Promise.resolve(contratoTeste));

    await ContratoService.deletar('1');

    expect(Contrato.destroy).toHaveBeenCalledTimes(1);
  });
});