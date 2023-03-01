import {ErroNaoAutorizacao} from './ErroNaoAutorizacao';
export class ErroPermissao extends ErroNaoAutorizacao {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroPermissao';
  }
}