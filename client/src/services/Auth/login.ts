import { api } from "../api";

interface LoginBody {
  email: string;
  senha: string;
}

export async function login(body: LoginBody) {
  await api.post("usuario/login", body);
}
