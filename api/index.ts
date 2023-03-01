import { app } from './config/expressConfig';

app.listen(process.env.PORT, () => {
  console.log('Conexão estabelecida com sucesso na porta ' + process.env.PORT);
});