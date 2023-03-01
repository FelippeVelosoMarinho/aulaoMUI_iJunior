import {Request, Response, NextFunction} from 'express';
import express from 'express';
const router = express.Router();
import statusCode from '../../../../utils/constants/statusCodes';
import ProjetoService from '../services/ProjetoService';
import { verifyJWT, checarCargoUsuario, checarExisteContrato, checarExisteNomeProjeto } from '../../../middlewares/authMiddlewares';
import userValidate from '../../../middlewares/typeValidator';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';
import { atributosProjeto } from '../models/Projeto';

router.get('/listarOrdenado/:atributo/:ordem',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN, cargosUsuario.USER]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      const projeto = await ProjetoService.listarOrdenado(req.params.atributo, req.params.ordem);

      res.status(statusCode.SUCCESS).json(projeto);
    } catch (error) {
      next(error);
    }
  });

router.get('/getProjeto/:id',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN, cargosUsuario.USER]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      const projeto:atributosProjeto = await ProjetoService.getProjeto(req.params.id) as atributosProjeto;

      res.status(statusCode.SUCCESS).json(projeto);
    } catch (error) {
      next(error);
    }
  });

router.post('/criarProjeto',
  verifyJWT,
  checarExisteContrato(),
  checarExisteNomeProjeto(),
  userValidate('criarProjeto'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProjetoService.criarProjeto( req.body );
      res.status(statusCode.CREATED).json('Projeto criado com sucesso');
    } catch (error) {
      next(error);
    }
  });

router.put('/editar/:id',
  verifyJWT,
  userValidate('editarProjeto'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProjetoService.editar(+req.params.id!, req.body);
      res.status(statusCode.SUCCESS).json('Projeto editado com sucesso');
    } catch (error) {
      next (error);
    }
  });

router.put('/adicionarUsuario/:idProjeto/:idUsuario',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      await ProjetoService.adicionarUsuario(req.params.idProjeto, req.params.idUsuario);
      res.status(statusCode.SUCCESS).json('Usuário adicionado ao projeto com sucesso');
    } catch (error) {
      next(error);
    }
  });

router.delete('/removerUsuario/:idProjeto/:idUsuario',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      await ProjetoService.removerUsuario(req.params.idProjeto, req.params.idUsuario);
      res.status(statusCode.SUCCESS).json('Usuário removido do projeto com sucesso');
    } catch (error) {
      next(error);
    }
  });

router.delete('/deletar/:id',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      await ProjetoService.deletar(+req.params.id);
      res.status(statusCode.SUCCESS).json('Projeto deletado com sucesso');
    } catch (error) {
      next(error);
    }
  });

export default router;
