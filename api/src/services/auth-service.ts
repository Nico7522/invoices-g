import supabase, { getAnonClient, getAuthClient } from "../config/supabase";
import { authToSession } from "../mappers/auth-mapper";

/**
 * Call the loginRepository and return the user and the session
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user, and the session
 */
export const loginService = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return authToSession(data);
};

export const logoutService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getUserService = async (accessToken: string) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);
  if (error) throw new Error(error.message);
  return { id: user?.id, email: user?.email };
};
