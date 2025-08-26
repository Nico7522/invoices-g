export interface Session {
  token: Token;
  user: User;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  expires: number;
}

interface User {
  id: string;
  email: string;
}
