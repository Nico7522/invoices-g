import e from "express";
import supabase, { getAuthClient } from "../config/supabase";
import { authToSession } from "../mappers/auth-mapper";
import CustomError from "../errors/custom-error";

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

export const getUserService = async (accessToken: string) => {
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
      status: error.status || 401,
    });

  return { id: user?.id, email: user?.email };
};
