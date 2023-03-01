import transportador from '../../../../config/nodemailer';

async function enviaEmail(email: string, token: string) {

  transportador.sendMail({
    from: 'Administrador <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: 'Recuperação de Senha!',
    text: `Seu token para recuperar a senha é: ${token}`
  });
}

export default enviaEmail;