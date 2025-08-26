import { Session, User } from "@supabase/auth-js";

export function authToSession(data: { user: User; session: Session }) {
  return {
    token: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expires: data.session.expires_in,
    },
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}
