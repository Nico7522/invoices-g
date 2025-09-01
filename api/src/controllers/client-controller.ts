import { Request, Response } from "express";
import {
  getClientByIdService,
  getClientsService,
  createClientService,
  updateClientService,
  deleteClientService,
} from "../services/client-service";

export const getClients = async (req: Request, res: Response) => {
  const clients = await getClientsService(req.supabase);
  return res
    .status(200)
    .json({ message: "Clients fetched successfully", data: clients });
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await getClientByIdService(id, req.supabase);
  return res
    .status(200)
    .json({ message: "Client fetched successfully", data: client });
};

export const createClient = async (req: Request, res: Response) => {
  const { name, surname, email, phoneNumber } = req.body;
  await createClientService(
    {
      name,
      surname,
      email,
      phoneNumber,
    },
    req.supabase
  );
  return res.status(200).json({ message: "Client created successfully" });
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, surname, email, phoneNumber } = req.body;
  await updateClientService(
    id,
    {
      name,
      surname,
      email,
      phoneNumber,
    },
    req.supabase
  );
  return res.status(200).json({ message: "Client updated successfully" });
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteClientService(id, req.supabase);
  return res.status(200).json({ message: "Client deleted successfully" });
};
