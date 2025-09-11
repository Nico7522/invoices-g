import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import {
  clientModelToClient,
  clientToClienDto,
} from "../mappers/client-mapper";

import { ClientModel } from "../models/client";

/**
 * Returns all clients retrieved from the database
 * @returns Array of clients using the clientToClienDto mapper
 */
export const getClientsService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase.from("clients").select("*");
  if (error)
    throw new CustomError({
      message: "Error fetching clients",
      code: "BAD_REQUEST",
      statusCode: 400,
    });

  return data.map(clientToClienDto);
};

/**
 * Returns a client retrieved from the database
 * @param id - The id of the client to return
 * @returns The client with the given id using the clientToClienDto mapper
 */
export const getClientByIdService = async (
  id: string,
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase
    .from("clients")
    .select()
    .eq("id", id)
    .single();

  if (error)
    throw new CustomError({
      message: "Error fetching client",
      code: "NOT_FOUND",
      statusCode: 404,
    });
  return clientToClienDto(data);
};

/**
 * Map a client model to a client and insert it into the database
 * @param client - The client to create
 */
export const createClientService = async (
  client: ClientModel,
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { error } = await supabase
    .from("clients")
    .insert(clientModelToClient(client));

  if (error)
    throw new CustomError({
      message: "Error creating client",
      code: "BAD_REQUEST",
      statusCode: 400,
    });
};

/**
 * Update a client
 * @param client - The client to update
 * @param supabase - The supabase client
 * @returns The updated client
 */
export const updateClientService = async (
  id: string,
  client: ClientModel,
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { error } = await supabase
    .from("clients")
    .update(clientModelToClient(client))
    .eq("id", id);

  if (error)
    throw new CustomError({
      message: "Error updating client",
      code: "BAD_REQUEST",
      statusCode: 400,
    });
};

/**
 * Delete a client
 * @param id - The id of the client to delete
 * @param supabase - The supabase client
 * @returns The deleted client
 */
export const deleteClientService = async (
  id: string,
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  console.log(error);

  if (error)
    throw new CustomError({
      message: "Error deleting client",
      code: "BAD_REQUEST",
      statusCode: 400,
    });
};
