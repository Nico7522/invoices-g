import { authToSession } from "../mappers/auth-mapper";
import { loginRepository } from "../repositories/auth-repository";

/**
 * Call the loginRepository and return the user and the session
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user, and the session
 */
export const loginService = async (email: string, password: string) => {
  const data = await loginRepository(email, password);
  return authToSession(data);
};
