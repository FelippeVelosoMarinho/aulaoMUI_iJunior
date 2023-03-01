import {Request, Response, NextFunction} from 'express';
import express from 'express';
const router = express.Router();
import {verifyJWT, checarCargoUsuario } from '../../../middlewares/authMiddlewares';
import multer from 'multer';
import multerConfig from '../../../middlewares/multer';
import ContratoService from '../services/ContratoService';
import statusCode from '../../../../utils/constants/statusCodes';
import userValidate from '../../../middlewares/typeValidator';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';

router.get('/listarOrdenado/:atributo/:ordem',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contratos = await ContratoService.listarOrdenado(req.params.atributo, req.params.ordem);
      res.status(statusCode.SUCCESS).json(contratos);
    } catch (error) {
      next (error);
    }
  });

router.get ('/getContrato/:id',
  verifyJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const contrato = await ContratoService.getContrato(+req.params.id!);
      res.status(statusCode.SUCCESS).json(contrato).end();
    } catch(error) {
      next(error);
    }
  });

router.post('/criar',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN, cargosUsuario.USER]),
  multer(multerConfig).single('arquivo'),
  userValidate('criarContrato'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ContratoService.criar(req.file, req.body);
      res.status(statusCode.CREATED).json('Registro criado com sucesso');
    } catch (error) {
      next (error);
    }
  });

router.put('/editar/:idContrato',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN, cargosUsuario.USER]),
  multer(multerConfig).single('arquivo'),
  userValidate('editarContrato'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ContratoService.editar(+req.params.idContrato!, req.body, req.file);
      res.status(statusCode.SUCCESS).json('Registro editado com sucesso');
    } catch (error) {
      next (error);
    }
  });

router.delete('/deletar/:id',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      await ContratoService.deletar(req.params.id);
      res.status(statusCode.SUCCESS).json('Contrato deletado com sucesso');
    } catch (error) {
      next(error);
    }
  });

export default router;