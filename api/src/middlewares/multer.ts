import multerS3 from 'multer-s3';
import path from 'path';
import crypto from 'crypto';
import { ErroEnvioArquivo } from '../../errors/ErroEnvioArquivo';
import {Request} from 'express';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Config = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACESSS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY_ID!,
  }
});

const armazenamento = {
  s3: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME! || '',
    contentType: multerS3.AUTO_CONTENT_TYPE, //arquivo aberto não sendo feito download direto
    acl: 'public-read',
    key: (req, arquivo, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          callback(error);
        }

        const nomeArquivo:string = `${arquivo.originalname}-${hash.toString('hex')}`;

        callback(null, nomeArquivo);
      });
    },
  })
};

export default {
  destination: path.resolve(__dirname, '..', '..', 'tpm', 'uploads'),
  storage: armazenamento['s3'],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req : Request, arquivo: any, callback: any) => {
    const tiposPermitidos = [
      'image/jpeg',
      'image/pjpeg',
      'image/jpg',
      'image/png',
      'image/pdf',
      'application/pdf'
    ];

    if (tiposPermitidos.includes(arquivo.mimetype)) {
      callback(null, true);
    } else {
      callback(new ErroEnvioArquivo ('Tipo de arquivo enviado inválido'));
    }
  },

};

export async function deletarArquivoAWS (S3Chave:string) {
  s3Config.send (
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: S3Chave
    })
  );

}
