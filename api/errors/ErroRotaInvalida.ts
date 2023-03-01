/**
 * Caso uma rota inválida ou inapropriada esteja sendo acessada.
 */
export class ErroRotaInvalida extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroRotaInvalida';
  }
}
