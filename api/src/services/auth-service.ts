import e from "express";
import supabase, { getAuthClient } from "../config/supabase";
import { authToSession } from "../mappers/auth-mapper";
import CustomError from "../errors/custom-error";

/**
 * Login the user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user, and the session
 */
export const loginService = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    throw new CustomError({
      type: "about:blank",
      title: error.name,
      detail: error.message || "Email or password is incorrect",
      instance: "/api/auth/login",
      status: error.status || 400,
    });

  return authToSession(data);
};

/**
 * Logout the user
 * @param supabase - The supabase client
 */
export const logoutService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { error } = await supabase.auth.signOut();
  if (error)
    throw new CustomError({
      type: "about:blank",
      title: error.name,
      detail: error.message || "Error during logout",
      instance: "/api/auth/logout",
      status: error.status || 400,
    });
};

/**
 * Get the user using the access token
 * @param accessToken - The access token
 * @returns The user
 */
export const getUserService = async (
  supabase: ReturnType<typeof getAuthClient>,
  accessToken: string
) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error)
    throw new CustomError({
      type: "about:blank",
      title: error.name,
      detail: error.message || "Unauthorized",
      instance: "/api/auth/getUser",
      status: 401,
    });

  return { id: user?.id, email: user?.email };
};
