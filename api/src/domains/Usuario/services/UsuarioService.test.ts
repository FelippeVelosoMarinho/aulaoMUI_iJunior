import UsuarioService from './UsuarioService';
import Usuario, { atributosUsuario } from '../models/Usuario';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';
import { ErroParametrosInvalidos } from '../../../../errors/ErroParametrosInvalidos';
import { ErroQuery } from '../../../../errors/ErroQuery';
import { ErroPermissao } from '../../../../errors/ErroPermissao';
import { DATEONLY } from 'sequelize';
import { ErroEnvioArquivo } from '../../../../errors/ErroEnvioArquivo';

import bcrypt from 'bcrypt';

jest.mock('bcrypt');

jest.mock('../models/Usuario', () => {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  };
});

jest.mock('../../../middlewares/multer', () => {
  return {
    deletarArquivoAWS: jest.fn(),
    s3Config: jest.fn(),
    multerConfig: jest.fn(),
  };
});

Usuario.findAll = jest.fn();

describe('Teste de listar ordenado', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  test('Deve listar todos os usuarios ordenado', async () => {

    const usuarioTeste = {
      id: 1,
      nome: 'Teste',
      email: 'emailTeste',
      senha: 'senhaTeste',
      foto: 'fotoTeste',
      telefone: 'telefoneTeste',
      dataNascimento: new Date(),
      cargo: cargosUsuario,
      S3Chave: 'S3ChaveTeste',
      urlFoto: 'urlFotoTeste'/* ,
      tokenRecSenha: 'tokenRecSenhaTeste',
      DataRecSenha: new Date(), */
    } as any;

    (Usuario.findAll as jest.MockedFunction<typeof Usuario.findAll>).mockImplementation(() => Promise.resolve([usuarioTeste]));

    await UsuarioService.listarOrdenado('nome', 'ASC');

    expect(Usuario.findAll).toHaveBeenCalledTimes(2);
  });

  test('Atributo de ordenação inválido ==> lança uma exceção', async () => {
    return expect(async () => {
      await UsuarioService.listarOrdenado('', 'ASC'); })
      .rejects.toThrow(new ErroParametrosInvalidos('Atributo a ser ordenado inválido'));
  });

  test ('Tipo de ordem invalida ==> lança uma exceção', async () => {
    return expect(async () => {
      await UsuarioService.listarOrdenado('nome', ''); })
      .rejects.toThrow(new ErroParametrosInvalidos('Tipo de ordem invalida'));
  });
});

describe ('Teste deletar usuario', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Recebe um usuario ==> é deletado', async () => {
    const id :number = 1;

    const usuarioDeletado = {
      id: id,
      nome: 'Teste',
      email: 'emailTeste',
      senha: 'senhaTeste',
      foto: 'fotoTeste',
      telefone: 'telefoneTeste',
      dataNascimento: new Date(),
      cargo: cargosUsuario,
    } as any;

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockImplementation((id) => {
      usuarioDeletado.id = id;
      return usuarioDeletado;
    });

    await UsuarioService.deletar(id);

    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
    expect(Usuario.destroy).toHaveBeenCalledTimes(1);

  });

  test ('Recebe um id invalido ==> lança uma exceção', async () => {
    const id = 10000^10000^10000;

    return expect(async () => {
      await UsuarioService.deletar(id); })
      .rejects.toThrow(new ErroQuery('Não existe esse usuario a ser deletado'));

  });
});

describe ('Teste de cadastrar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Recebe um objeto com valores do usuario => cria um usuario no banco', async () => {

    const usuarioTeste = {
      id: 1,
      nome: 'teste',
      email: 'teste@teste.com',
      senha: '123',
      telefone: '(31)123456789',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario,
      tokenRecSenha: 'a',
      DataRecSenha: new Date(),
    } as atributosUsuario;

    const foto = {
      urlFoto: 'urlTeste',
      S3Chave: 'chaveTeste'
    };

    (Usuario.create as jest.MockedFunction<typeof Usuario.create>).mockImplementation (
      () => {
        return {};
      });

    await UsuarioService.cadastrar(usuarioTeste, foto);

    expect(Usuario.create).toHaveBeenCalledTimes(1);
  });

  test ('Recebe foto null ==> lança excecao', async () => {

    const usuarioTeste = {
      id: 1,
      nome: 'teste',
      email: 'teste@teste.com',
      senha: '123',
      telefone: '(31)123456789',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario,
      tokenRecSenha: 'a',
      DataRecSenha: new Date(),
    } as atributosUsuario;

    await expect(UsuarioService.cadastrar(usuarioTeste, null)).rejects.toThrow(new ErroEnvioArquivo('Foto inexistente'));

  });

  test('recebe um id => retorna o usuario correspondente', async () => {

    const idEmailRepetido:number = 1;

    const usuarioTeste = {
      id: idEmailRepetido,
      nome: 'teste',
      email: 'teste@teste.com',
      senha: '123',
      telefone: '(31)123456789',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario,
      tokenRecSenha: 'a',
      DataRecSenha: new Date(),
    } as atributosUsuario;

    const foto = {
      urlFoto: 'urlTeste',
      S3Chave: 'chaveTeste'
    };

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockResolvedValue(usuarioTeste);

    await expect(UsuarioService.cadastrar(usuarioTeste, foto)).rejects.toThrow(new ErroParametrosInvalidos('Informe outro email para o usuario'));


  });

});

describe ('Teste de listar pelo id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const usuarioTeste = {
    id: 1,
    nome: 'GustavoTeste',
    email: 'gustavo@exemplo.com',
    senha: '123',
    telefone: '(31)123456789',
    dataNascimento: '2000/01/01',
    cargo: 'admin',
  } as any;

  test('recebe um id => retorna o usuario correspondente', async () => {

    const id = 1;

    (Usuario.findByPk as jest.MockedFunction<typeof Usuario.findByPk>).mockImplementation(
      (id:any) => {
        usuarioTeste.id = id;
        return usuarioTeste;
      }
    );

    const usuarioRetornado = await UsuarioService.listarPeloId(id);
    expect (usuarioRetornado).toStrictEqual(usuarioTeste);
    expect(Usuario.findByPk).toHaveBeenCalledTimes(1);
  });

  test ('Recebe id invalido ==> lança excecao', async() => {
    const idInvalido: number = 1000^1000;
    await expect(UsuarioService.listarPeloId(idInvalido)).rejects.toThrow(new ErroQuery('Não há um usuário com o ID informado'));
  });
});

describe ('Teste de atualizar usuario pelo id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('Usuario admin atualiza ele mesmo', async () => {

    const id:any = 1;

    const usuarioTeste = {
      id: id,
      nome: 'dummyTeste',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario.ADMIN,
      update: jest.fn(),
    } as any;

    (Usuario.findByPk as jest.MockedFunction<typeof Usuario.findByPk>).mockResolvedValue(usuarioTeste);

    var atualizacao = {
      id: 1,
      nome: 'usuarioAtualizado',
      email: 'teste@teste.com',
      senha: '1234',
      telefone: '(31)123456789',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario.ADMIN,
    } as any;

    atualizacao.senha = await bcrypt.hash(atualizacao.senha, 10);

    const usuarioAtualizado = {
      id: 1,
      nome: 'usuarioAtualizado',
      email: 'teste@teste.com',
      senha: (atualizacao.senha),
      telefone: '(31)123456789',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario.ADMIN,
    } as any;

    await UsuarioService.atualizarUsuario(id, atualizacao, usuarioTeste, null);

    expect(Usuario.findByPk).toHaveBeenCalledTimes(1);
    expect(usuarioAtualizado).toStrictEqual(atualizacao);
  });

  test('Tentativa de atualizar com id invalido ==> lança excecao', async () => {
    const idInvalido = 150^150^150;

    const usuarioTeste = {
      id: 1,
      nome: 'dummyTeste',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario,
      update: jest.fn(),
    } as any;

    const atualizacao = {
      nome: 'torres',
    } as any;

    const foto = {
      location: 'urlTeste',
      key: 'chaveTeste'
    };

    await expect(UsuarioService.atualizarUsuario(idInvalido, atualizacao, usuarioTeste, foto)).rejects.toThrow(new ErroQuery('Não há um usuário com o ID informado'));
  });

  test('Tentativa de Atualizar sem permissão o proprio cargo ==> lança excecao', async () => {

    const id = 1;

    const usuarioATualizado = {
      id: 1,
      nome: 'dummyTeste',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario,
      update: jest.fn(),
    } as any;

    const usuarioTrainee = {
      id: id,
      nome: 'torres',
      foto: 'testeFoto.jpg',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario.TRAINEE,
      update: jest.fn(),
    } as any;

    const foto = {
      location: 'urlTeste',
      key: 'chaveTeste'
    };

    (Usuario.findByPk as jest.MockedFunction<typeof Usuario.findByPk>).mockImplementation((id) => {
      usuarioTrainee.id = id;
      return usuarioTrainee;
    });

    return expect(async () => {
      await UsuarioService.atualizarUsuario(id, usuarioATualizado, usuarioTrainee, foto); }
    ).rejects.toThrow(new ErroPermissao('Você não tem permissão para editar seu cargo'));
  });

  test('Tentativa de Atualizar sem permissão outro usuario ==> lança excecao', async () => {

    const id = 2;

    const usuarioAtualizado = {
      id: 2,
      nome: 'dummyTeste',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario,
      update: jest.fn(),
    } as any;

    const usuarioRetornado = {
      id: 2,
      nome: 'dummyTeste',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario,
      update: jest.fn(),
    } as any;

    const usuarioTrainee = {
      id: 1,
      nome: 'torres',
      foto: 'testeFoto.jpg',
      email: 'teste@ijunior.com',
      senha: '123',
      telefone: '(31)40028922',
      dataNascimento: '2002/01/01',
      cargo: cargosUsuario.TRAINEE,
      update: jest.fn(),
    } as any;

    const foto = {
      location: 'urlTeste',
      key: 'chaveTeste'
    };

    (Usuario.findByPk as jest.MockedFunction<typeof Usuario.findByPk>).mockImplementation((id) => {
      usuarioRetornado.id = id;
      return usuarioRetornado;
    });

    return expect(async () => {
      await UsuarioService.atualizarUsuario(id, usuarioAtualizado, usuarioTrainee, foto); }
    ).rejects.toThrow(new ErroPermissao('Você não tem permissão para editar outro usuário!'));
  });
});

describe('Teste do perfil de usuario', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  test('Usuario lista ele mesmo ==> retorna o usuario', async () => {

    const idListagem:string = '1';

    const usuarioTeste = {
      id: 1,
      nome: 'teste',
      email: 'emailTeste',
      senha: 'senhaTeste',
      telefone: 'telefoneTeste',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario,
    } as atributosUsuario;

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockResolvedValue(usuarioTeste);

    await UsuarioService.perfilUsuario(idListagem, 'user', idListagem);

    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
    expect(Usuario.findOne).toBeCalledTimes(+idListagem);
  });

  test('Usuario admin pode listar qualquer usuario', async () => {

    const idListagem:string = '1';
    const idUsuario:string = '2';

    const usuarioTeste = {
      id: 1,
      nome: 'teste',
      email: 'emailTeste',
      senha: 'senhaTeste',
      telefone: 'telefoneTeste',
      dataNascimento: new DATEONLY(),
      cargo: cargosUsuario,
    } as atributosUsuario;

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockResolvedValue(usuarioTeste);

    await UsuarioService.perfilUsuario(idUsuario, 'admin', idListagem);

    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
    expect(Usuario.findOne).toBeCalledTimes(+idListagem);
  });

  test('Id inexistente inexistente ==> lança uma exceção', async () => {

    const idUsuario:string = '10^10^10';

    (Usuario.findOne as any).mockResolvedValue(null);

    await expect(UsuarioService.perfilUsuario(idUsuario, 'admin', idUsuario)).rejects.toThrow(new ErroQuery('Não existe usuario com esse id'));
  });

  test('Id inexistente ==> lança uma exceção', async () => {

    const idUsuario:string = '10^10^10';

    (Usuario.findOne as any).mockResolvedValue(null);

    await expect(UsuarioService.perfilUsuario(idUsuario, 'admin', idUsuario)).rejects.toThrow(new ErroQuery('Não existe usuario com esse id'));
  });

  test('Usuario que não é admin tenta listar outro ==> lança uma exceção', async () => {

    const idUsuario:string = '1';
    const idListagem:string = '2';

    (Usuario.findOne as any).mockResolvedValue(null);

    await expect(UsuarioService.perfilUsuario(idUsuario, 'user', idListagem)).rejects.toThrow(new ErroPermissao('Você não possui permissão para ver as informações de outro usuário'));
  });

});

describe ('Teste de listar pelo email', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const usuarioTeste = {
    id: 1,
    nome: 'teste',
    email: 'teste@teste.com',
    senha: '123',
    telefone: '(31)123456789',
    dataNascimento: '2000/01/01',
    cargo: 'admin',
  } as any;

  test('Recebe um email => retorna o usuario correspondente', async () => {

    const emailTeste:string = 'teste@teste.com';

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockImplementation((emailTeste) => {
      usuarioTeste.email = emailTeste;
      return usuarioTeste;
    });

    const usuarioRetornado = await UsuarioService.listarPeloEmail(emailTeste);

    expect (usuarioRetornado).toStrictEqual(usuarioTeste);
    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
  });

  test ('Recebe email invalido ==> lança excecao', async() => {
    const emailInvalido: string = '';
    await expect(UsuarioService.listarPeloEmail(emailInvalido)).rejects.toThrow(new ErroQuery ('Email não cadastrado!'));
  });
});

describe ('Teste de atualizar senha', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const usuarioTeste = {
    id: 1,
    nome: 'teste',
    email: 'teste@teste.com',
    senha: '123',
    telefone: '(31)123456789',
    dataNascimento: '2000/01/01',
    cargo: 'admin',
    update: jest.fn(),
  } as any;

  test('Recebe uma nova senha => atualiza a senha do usuario', async () => {

    var novaSenha:string = '321';

    const emailTeste:string = usuarioTeste.email;

    (Usuario.findOne as jest.MockedFunction<typeof Usuario.findOne>).mockImplementation((emailTeste) => {
      usuarioTeste.email = emailTeste;
      return usuarioTeste;
    });

    novaSenha = await bcrypt.hash(novaSenha, 10);
    usuarioTeste.senha = novaSenha;

    await UsuarioService.atualizarSenha(novaSenha, emailTeste);

    expect(usuarioTeste.senha).toStrictEqual(novaSenha);
    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
    expect(usuarioTeste.update).toHaveBeenCalledTimes(1);
  });

  test ('Recebe email invalido ==> lança excecao', async() => {
    const emailInvalido: string = '';
    await expect(UsuarioService.atualizarSenha('123', emailInvalido)).rejects.toThrow(new ErroQuery ('Email não cadastrado!'));
  });
});

