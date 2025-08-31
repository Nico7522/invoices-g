import { Database } from "../models/database.types";
import { ClientModel } from "../models/client";

/**
 * Maps a client from the database to a client DTO
 * @param client - The client to map
 * @returns The client DTO
 */
export function clientToClienDto(
  client: Database["public"]["Tables"]["clients"]["Row"]
) {
  return {
    id: client.id,
    name: client.name,
    surname: client.surname,
    email: client.email,
    phoneNumber: client.phone_number,
  };
}

/**
 * Maps a new created client to a client
 * @param client - The client to map
 * @returns The client
 */
export function clientModelToClient(clientModel: ClientModel) {
  return {
    name: clientModel.name,
    surname: clientModel.surname,
    email: clientModel.email,
    phone_number: clientModel.phoneNumber,
  };
}
