/**
 * O parâmetro passado não atende aos requerimentos exigidos.
 */
export class ErroParametrosInvalidos extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroParametrosInvalidos';
  }
}