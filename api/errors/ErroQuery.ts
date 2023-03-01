/**
 * Dados informados para uma requisição no banco de dados são incompatíveis
 * ou inválidos.
 */
export class ErroQuery extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroQuery';
  }
}