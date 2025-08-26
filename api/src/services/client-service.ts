import {
  clientModelToClient,
  clientToClienDto,
} from "../mappers/client-mapper";
import {
  getClientByIdRepository,
  getClientsRepository,
  createClientRepository,
} from "../repositories/client-repository";
import { ClientModel } from "../types/client";

/**
 * Returns all clients retrieved from the client repository
 * @returns Array of clients using the clientToClienDto mapper
 */
export const getClientsService = async () => {
  const clients = await getClientsRepository();
  return clients.map(clientToClienDto);
};

/**
 * Returns a client retrieved from the client repository
 * @param id - The id of the client to return
 * @returns The client with the given id using the clientToClienDto mapper
 */
export const getClientByIdService = async (id: string) => {
  const client = await getClientByIdRepository(id);
  return clientToClienDto(client);
};

/**
 * Map a client model to a client and call the createClientRepository
 * @param client - The client to create
 */
export const createClientService = async (client: ClientModel) => {
  await createClientRepository(clientModelToClient(client));
};
