
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface ValidatedUser {
  userId: number;
  email: string;
  role: string | null;
}
