/* eslint-disable no-useless-escape */
import { validate } from './validate';
import { body } from 'express-validator';
import { cargosUsuario } from '../../utils/constants/cargosUsuario';


const getValidator = (method: any) => {
  switch (method) {
  case 'login': {
    return [
      body('email')
        .exists()
        .withMessage('O email é obrigatório')
        .isEmail()
        .withMessage('O email deve ser válido'),
      body('senha')
        .exists()
        .withMessage('Você deve inserir uma senha!'),
    ];
  }
  case 'cadastrarUsuario': {
    return [
      body('nome')
        .exists()
        .withMessage('O nome é obrigatório')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve conter somente letras!'),
      body('email')
        .exists()
        .withMessage('O email é obrigatório')
        .isEmail()
        .withMessage('O email deve ser válido'),
      body('senha')
        .exists()
        .withMessage('Você deve inserir uma senha!'),
      body('telefone')
        .exists()
        .withMessage('O telefone é obrigatório')
        .matches(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/)
        .withMessage('O telefone deve ser válido'),
      body('dataNascimento')
        .exists()
        .withMessage('A data de nascimento é obrigatória')
        .isDate()
        .withMessage('A data de nascimento deve ser válida'),
      body('cargo')
        .optional()
        .isIn(Object.values(cargosUsuario))
        .withMessage('O cargo deve ser válido'),
    ];
  }
  case 'editarUsuario': {
    return [
      body('nome')
        .optional()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve conter somente letras!'),
      body('foto')
        .optional(),
      body('email')
        .optional()
        .isEmail()
        .withMessage('O email deve ser válido'),
      body('senha')
        .optional(),
      body('telefone')
        .optional()
        .matches(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/)
        .withMessage('O telefone deve ser válido'),
      body('dataNascimento')
        .optional()
        .isDate()
        .withMessage('A data de nascimento deve ser válida'),
      body('cargo')
        .optional()
        .isIn(Object.values(cargosUsuario))
        .withMessage('O cargo deve ser válido'),
    ];
  }
  case 'resetarSenha': {
    return [
      body('email')
        .exists()
        .withMessage('O email é obrigatório')
        .isEmail()
    ];
  }
  case 'criarContrato': {
    return [
      body('titulo')
        .exists()
        .withMessage('O titulo é obrigatório'),
      body('nomeCliente')
        .exists()
        .withMessage('O nome é obrigatório')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve conter somente letras!'),
      body('valor')
        .exists()
        .matches(/^\d*(\.\d\d)*(\.\d)?$/)
        .withMessage('O valor deve possui até 2 casas decimais separados por ponto . '),
      body('dataContrato')
        .optional()
        .isDate()
        .withMessage('A data do contrato deve ser válida'),
    ];
  }
  case 'editarContrato': {
    return [
      body('titulo')
        .optional(),
      body('nomeCliente')
        .optional()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve conter somente letras!'),
      body('valor')
        .optional()
        .matches(/^\d*(\.\d\d)*(\.\d)?$/)
        .withMessage('O valor deve possui até 2 casas decimais separados por ponto . '),
      body('dataContrato')
        .optional()
        .isDate()
        .withMessage('A data do contrato deve ser válida'),
    ];
  }
  case 'criarProjeto': {
    return [
      body('nome')
        .exists()
        .withMessage('O nome é obrigatório')
        .isAlpha( 'pt-BR', { ignore: ' ' }),
      body('dataEntrega')
        .exists()
        .withMessage('A data de entrega é obrigatória')
        .isDate()
        .withMessage('A data de entrega deve ser válida'),
    ];
  }
  case 'editarProjeto': {
    return [
      body('nome')
        .optional()
        .isAlpha( 'pt-BR', { ignore: ' ' }),
      body('dataEntrega')
        .optional()
        .isDate()
        .withMessage('A data de entrega deve ser válida'),
    ];
  }
  }
};

export function userValidate(method: any) {
  const validations = getValidator(method);
  return validate(validations);
}

export default userValidate;