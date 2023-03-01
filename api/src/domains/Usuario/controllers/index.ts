import {Request, Response, NextFunction} from 'express';
import enviaEmail from '../services/EnviaEmail';
import express from 'express';
import UsuarioService from  '../services/UsuarioService';
import {userValidate} from '../../../middlewares/typeValidator';
import statusCode from '../../../../utils/constants/statusCodes';
import crypto from 'crypto';
import {notLoggedIn, loginMiddleware, verifyJWT, checarCargoUsuario} from '../../../middlewares/authMiddlewares';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';
import multer from 'multer';
import multerConfig from '../../../middlewares/multer';
const router = express.Router();

router.get ('/listarOrdenado/:atributo/:ordem',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const usuario = await UsuarioService.listarOrdenado(req.params.atributo, req.params.ordem);
      res.status(statusCode.SUCCESS).json(usuario).end();
    } catch(error) {
      next(error);
    }
  });

router.get ('/perfilUsuario/:id',
  verifyJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const usuario = await UsuarioService.perfilUsuario(req.user.id!, req.user.cargo!, req.params.id!);
      res.status(statusCode.SUCCESS).json(usuario).end();
    } catch(error) {
      next(error);
    }
  });

router.get ('/retornarUsuarioLogado',
  verifyJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const usuarioLogado = await UsuarioService.perfilUsuario(req.user.id, req.user.cargo, req.user.id);
      res.status(statusCode.SUCCESS).json(usuarioLogado).end();
    } catch(error) {
      next(error);
    }
  });

router.post('/login', notLoggedIn, loginMiddleware, userValidate('login'),);

router.post('/logout',
  verifyJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('jwt');
      res.status(statusCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  },
);

router.post('/resetarSenha',
  userValidate('resetarSenha'),
  async(req: Request, res: any, next: any) => {
    try{
      const token = crypto.randomBytes(20).toString('hex');
      const data = new Date();
      data.setHours(data.getHours() + 1);
      await UsuarioService.adicionaToken(token, data, req.body.email);
      await enviaEmail(req.body.email, token);
      res.status(statusCode.SUCCESS).end();
    } catch(error){
      next(error);
    }
  });

router.post('/recuperarSenha',
  async(req: Request, res: Response, next: NextFunction) => {
    try{
      const {email, token, senha} = req.body;
      await UsuarioService.verificaToken(email, token);
      await UsuarioService.atualizarSenha(senha, email);
      res.status(statusCode.SUCCESS).end();
    } catch(error){
      next(error);
    }
  });

router.post('/cadastrar',
  multer(multerConfig).single('foto'),
  userValidate('cadastrarUsuario'),
  async(req: any, res: any, next: any) =>{
    try{
      await UsuarioService.cadastrar(req.body, req.file);
      res.status(statusCode.CREATED).json('Usuario criado com sucesso');
    }catch(error){
      next(error);
    }
  });

router.put('/editar/:idUsuario',
  verifyJWT,
  multer(multerConfig).single('foto'),
  userValidate('editarUsuario'),
  async(req: Request, res: Response, next: NextFunction) =>{
    try{
      await UsuarioService.atualizarUsuario(+req.params.idUsuario!, req.body, req.user, req.file);
      res.status(statusCode.SUCCESS).end();
    }catch(error){
      next(error);
    }

  });

router.delete('/deletar/:idUsuario',
  verifyJWT,
  checarCargoUsuario([cargosUsuario.ADMIN]),
  async(req: Request, res: Response, next: NextFunction) =>{
    try{
      await UsuarioService.deletar(+req.params.idUsuario);
      res.status(statusCode.SUCCESS).end();
    }catch(error){
      next(error);
    }
  });


export default router;
