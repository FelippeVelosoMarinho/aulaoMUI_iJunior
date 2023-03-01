import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import Usuario from '../domains/Usuario/models/Usuario';
import { PayloadParams } from '../domains/Usuario/types/PayLoadParams';
import { Request, Response, NextFunction } from 'express';
import { ErroToken } from '../../errors/ErroToken';
import { ErroParametrosInvalidos } from '../../errors/ErroParametrosInvalidos';
import { ErroLogin } from '../../errors/ErroLogin';
import Contrato from '../domains/Contrato/models/Contrato';
import Projeto from '../domains/Projetos/models/Projeto';

function generateJWT(user: PayloadParams, res: Response) {
  const body = {
    id: user.id,
    name: user.nome,
    email: user.email,
    cargo: user.cargo,
  };

  const token = sign({ user: body }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
  });
}

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }

  return token;
}

export async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await Usuario.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw new ErroParametrosInvalidos('E-mail e/ou senha incorretos!');
    }
    const matchingPassword = await compare(req.body.senha, user.senha);
    if (!matchingPassword) {
      throw new ErroParametrosInvalidos('Senha incorreta!');
    }

    generateJWT(user, res);

    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

export function notLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = cookieExtractor(req);

    if (token) {
      const decoded = verify(token, process.env.SECRET_KEY);
      if (decoded) {
        throw new ErroLogin('Você já está logado no sistema!');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const token = cookieExtractor(req);
    if (token) {
      const decoded = verify(token, process.env.SECRET_KEY) as JwtPayload;
      req.user = decoded.user;
    }
    if (!req.user) {
      throw new ErroToken('Você precisa estar logado para realizar essa ação!');
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const checarCargoUsuario = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      !roles.includes(req.user!.cargo) ? res.json('Você não possui permissão para realizar essa ação') : next();
    } catch (error) {
      next(error);
    }
  };
};

export const checarExisteContrato = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contrato = await Contrato.findOne({ where: { id: req.body.ContratoId } });
      // console.log(contrato);
      if (contrato==null) {
        throw new Error ('Contrato não encontrado!');
      }else{
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export const checarExisteNomeProjeto = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projeto = await Projeto.findOne({ where: { nome: req.body.nome } });
      if (projeto !== null) {
        throw new Error ('Nome indisponível!');
      }else{
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};
