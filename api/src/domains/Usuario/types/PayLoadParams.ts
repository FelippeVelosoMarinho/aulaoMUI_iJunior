import { DateOnlyDataType } from 'sequelize';
import { cargosUsuario } from '../../../../utils/constants/cargosUsuario';

export interface PayloadParams {
    id: number,
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    dataNascimento: DateOnlyDataType,
    tokenRecSenha: string,
    DataRecSenha: Date,
    urlFoto: string,
    S3Chave: string,
    cargo: typeof cargosUsuario,
}