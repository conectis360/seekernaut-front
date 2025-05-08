export interface User {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  // ... outras propriedades do usuário
}
export interface Usuario {
  id: number; // Ou Long, dependendo do tipo no backend
  email: string;
  nome: string;
  foto: string | null; // Ou Array<number> se você for trabalhar com o byte array diretamente no frontend
  senha?: string; // Geralmente não é enviado do backend para o dashboard
  usuario: string;
  accountNonLocked: boolean;
  tipoUsuario?: { id: number; tipoUsuario: "USER" }[]; // Ajuste conforme a estrutura real
}
