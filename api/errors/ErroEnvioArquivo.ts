//erro de tipo de arquivo não permitido multer
export class ErroEnvioArquivo extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ErroEnvioArquivo';
  }
}