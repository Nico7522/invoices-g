import supabase from "../config/supabase";
import { authToSession } from "../mappers/auth-mapper";

/**
 * Login a user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user, and the session
 */
export const loginRepository = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
};
