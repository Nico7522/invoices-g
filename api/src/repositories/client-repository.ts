import supabase from "../config/supabase";
import { Database } from "../types/database.types";

/**
 * Returns all clients from the database
 * @returns Array of clients from the database
 */
export const getClientsRepository = async () => {
  const { data, error } = await supabase.from("clients").select();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Returns a client by id from the database
 * @param id - The id of the client to return
 * @returns The client with the given id
 */
export const getClientByIdRepository = async (id: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

/**
 * Insert a client in the database
 * @param client - The client to create
 */
export const createClientRepository = async (
  client: Database["public"]["Tables"]["clients"]["Insert"]
) => {
  const { error } = await supabase.from("clients").insert(client);
  if (error) throw new Error(error.message);
};
