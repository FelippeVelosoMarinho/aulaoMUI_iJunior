/**
 * Usuario tentando logar mais de uma vez
 */
export class ErroLogin extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroLogin';
  }
}