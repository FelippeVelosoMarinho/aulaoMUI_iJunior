import ProjetoUsuario from '../../Projeto-Usuario/models/ProjetoUsuario';
import Usuario from '../../Usuario/models/Usuario';
import Projeto from '../models/Projeto';
import ProjetoService from './ProjetoService';

jest.mock('../models/Projeto', ()=> {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    belongsToMany: jest.fn(),
    hasMany: jest.fn()
  };
});

jest.mock('../../Projeto-Usuario/models/ProjetoUsuario', () => {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    belongsToMany: jest.fn(),
    hasMany: jest.fn()
  };
});

jest.mock('../../Usuario/models/Usuario', ()=> {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    belongsToMany: jest.fn(),
    hasMany: jest.fn()
  };
});

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Teste de criar projeto', () =>{
  test('Recebe dados e projeto => cria o projeto no banco', async () => {
    const projeto = {
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3,
      UsuarioId: 7
    };

    await ProjetoService.criarProjeto(projeto);

    expect(Projeto.create).toHaveBeenCalledTimes(1);
    expect(Projeto.create).toHaveBeenCalledWith({
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    });
  });
});

describe('teste de editar projeto', () => {
  test('Recebe um projeto => atualiza projeto no banco', async ()=> {
    let projetoInicial = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3,
      update: (novoProjeto: any) => {
        projetoInicial = novoProjeto;
        return Promise.resolve(projetoInicial);
      }
    };

    Projeto.findByPk = jest.fn().mockReturnValue(projetoInicial);
    Projeto.update = jest.fn();

    const id = 1;
    const projetoAlterado = {
      nome: 'Projeto Modificado',
      dataEntrega: '22/02/2022',
      ContratoId: 3
    };

    await ProjetoService.editar(id, projetoAlterado);

    expect(projetoInicial).toStrictEqual(projetoAlterado);
  });

  test('Recebe um projeto inexistente => lança um erro', async ()=> {
    const id = 1;
    const projeto = {
      nome: 'Projeto Teste',
      dataEntrega: '22/02/2022',
      ContratoId: 3
    };

    Projeto.findByPk = jest.fn().mockResolvedValue(null);

    await expect(ProjetoService.editar(id, projeto)).rejects.toThrow('Projeto não encontrado');
    expect(Projeto.findByPk).toHaveBeenCalledWith(id);
  });
});

describe('Teste de deletar projeto', () => {
  test('Recebe um id => deleta usuário no banco', async ()=> {
    const id = 1;
    const projeto = {
      destroy: () => {}
    };

    Projeto.findByPk = jest.fn().mockResolvedValue(projeto);

    await ProjetoService.deletar(id);

    expect(Projeto.findByPk).toHaveBeenCalledTimes(1);
    expect(Projeto.findByPk).toHaveBeenCalledWith(id);
  });

  test ('Recebe um id inválido => retorna um erro', async ()=> {

    Projeto.findByPk = jest.fn().mockResolvedValue(null);

    const id = 1992;

    await expect(ProjetoService.deletar(id)).rejects.toThrow('Projeto não encontrado');
    expect(Projeto.findByPk).toBeCalledWith(id);
  });
});

describe('teste de retornar (getProjeto)', ()=> {
  test('Recebe um id => retorna um projeto', async ()=> {
    const projeto = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    } as any;

    Projeto.findByPk = jest.fn().mockImplementation((id)=>{
      projeto.id = +id;
      return projeto;
    });

    const id = '1';
    const retornoDeGetProjeto = await ProjetoService.getProjeto(id);

    expect(Projeto.findByPk).toBeCalledTimes(1);
    expect(retornoDeGetProjeto).toStrictEqual({
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    });
  });
  test('Recebe um id inválido => retorna um erro', async ()=>{
    Projeto.findByPk = jest.fn().mockResolvedValue(null);
    const id = '2023';

    await expect(ProjetoService.getProjeto(id)).rejects.toThrow('Projeto não encontrado');
    expect(Projeto.findByPk).toBeCalledTimes(1);
  });
});

describe('teste de listar ordenado', ()=>{
  test('Deve listar todos os projetos ordenados', async ()=> {
    const projeto = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    } as any;

    Projeto.findAll = jest.fn().mockResolvedValue(projeto);
    await ProjetoService.listarOrdenado('nome', 'ASC');
    expect(Projeto.findAll).toBeCalledTimes(1);
  });

  test('Atributo de ordenação inválido => lança um erro', async ()=>{
    await expect( ProjetoService.listarOrdenado('', 'ASC')).rejects.toThrow('Atributo a ser ordenado inválido');
  });

  test('Tipo de ordem inválido => lança um erro', async ()=>{
    await expect( ProjetoService.listarOrdenado('nome', '')).rejects.toThrow('Tipo de ordem invalida');
  });

  test('listar sem existir projetos => lança um erro', async ()=> {
    Projeto.findAll = jest.fn().mockResolvedValue(null);
    await expect(ProjetoService.listarOrdenado('nome', 'ASC')).rejects.toThrow('Projeto não encontrado');
  });
});

describe('teste de adicionar usuario no projeto', ()=> {
  test('Deve receber um id e um usuario => acrescenta usuário no projeto', async ()=> {
    const projeto = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    };
    const usuario = {
      id: 16
    };

    Projeto.findByPk = jest.fn().mockResolvedValue(projeto);
    Usuario.findByPk = jest.fn().mockResolvedValue(usuario);

    const idProjeto = '1';
    const idUsuario = '16';
    await ProjetoService.adicionarUsuario(idProjeto, idUsuario);

    expect(Projeto.findByPk).toBeCalledTimes(1);
    expect(Usuario.findByPk).toBeCalledTimes(1);
  });

  test('Recebe um id de Projeto inválido => lança um erro', async ()=>{
    Projeto.findByPk = jest.fn().mockResolvedValue(null);

    const idProjeto = '1';
    const idUsuario = '1';

    await expect(ProjetoService.adicionarUsuario(idProjeto, idUsuario)).rejects.toThrow('Projeto ou usuário não encontrado');
    expect (Projeto.findByPk).toBeCalledWith(+idProjeto);
  });

  test('Recebe um id de Usuário inválido => lança um erro', async ()=>{
    Usuario.findByPk = jest.fn().mockResolvedValue(null);

    const idProjeto = '1';
    const idUsuario = '1';

    await expect(ProjetoService.adicionarUsuario(idProjeto, idUsuario)).rejects.toThrow('Projeto ou usuário não encontrado');
    expect (Usuario.findByPk).toBeCalledWith(+idUsuario);
  });
});

describe('teste de remover usuario no projeto', ()=> {
  test('Deve receber um id e um usuario => remove usuario do projeto', async ()=> {
    const projeto = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    };
    const usuario = {
      id: 16
    };
    const usuarioDeletar = {
      destroy: () => {}
    };

    Projeto.findByPk = jest.fn().mockResolvedValue(projeto);
    Usuario.findByPk = jest.fn().mockResolvedValue(usuario);
    ProjetoUsuario.findOne = jest.fn().mockResolvedValue(usuarioDeletar);

    const idProjeto = '1';
    const idUsuario = '16';
    await ProjetoService.removerUsuario(idProjeto, idUsuario);

    expect(Projeto.findByPk).toBeCalledTimes(1);
    expect(Usuario.findByPk).toBeCalledTimes(1);
    expect(ProjetoUsuario.findOne).toBeCalledTimes(1);
  });
  test('Recebe um id de Projeto inválido => lança um erro', async ()=>{
    Projeto.findByPk = jest.fn().mockResolvedValue(null);

    const idProjeto = '1';
    const idUsuario = '1';

    await expect(ProjetoService.removerUsuario(idProjeto, idUsuario)).rejects.toThrow('Projeto ou usuário não encontrado');
    expect (Projeto.findByPk).toBeCalledWith(+idProjeto);
  });

  test('Recebe um id de Usuário inválido => lança um erro', async ()=>{
    Usuario.findByPk = jest.fn().mockResolvedValue(null);

    const idProjeto = '1';
    const idUsuario = '1';

    await expect(ProjetoService.removerUsuario(idProjeto, idUsuario)).rejects.toThrow('Projeto ou usuário não encontrado');
    expect (Usuario.findByPk).toBeCalledWith(+idUsuario);
  });
  test('Recebe um id de Usuário inválido => lança um erro', async ()=>{
    const projeto = {
      id: 1,
      dataEntrega: '28/02/2025',
      nome: 'Projeto teste',
      ContratoId: 3
    };
    const usuario = {
      id: 16
    };

    Projeto.findByPk = jest.fn().mockResolvedValue(projeto);
    Usuario.findByPk = jest.fn().mockResolvedValue(usuario);
    ProjetoUsuario.findOne = jest.fn().mockResolvedValue(null);

    const idProjeto = '1';
    const idUsuario = '16';

    await expect(ProjetoService.removerUsuario(idProjeto, idUsuario)).rejects.toThrow('Projeto ou usuário não encontrado');
    expect (Usuario.findByPk).toBeCalledWith(+idUsuario);
    expect (Projeto.findByPk).toBeCalledWith(+idProjeto);
  });
});

describe('teste de adicionar vários usuários', ()=> {
  test('Recebe um body e um projeto => adiciona os usuários', async ()=> {
    const projeto = {
      dataEntrega: '28/03/2025',
      nome: 'Nome de Teste',
      ContratoId: 3
    } as any;
    const body = {
      dataEntrega: '28/03/2025',
      nome: 'Nome de Teste',
      ContratoId: 3,
      UsuarioId: [3, 4, 5, 6]
    };
    await ProjetoService.adicionarVariosUsuarios(body, projeto);

    expect(ProjetoUsuario.create).toBeCalledTimes(4);
  });
});

