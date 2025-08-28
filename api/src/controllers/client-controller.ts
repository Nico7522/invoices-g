import { Request, Response } from "express";
import {
  getClientByIdService,
  getClientsService,
  createClientService,
} from "../services/client-service";

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await getClientsService(req.supabase);
    return res
      .status(200)
      .json({ message: "Clients fetched successfully", data: clients });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await getClientByIdService(id, req.supabase);
    return res
      .status(200)
      .json({ message: "Client fetched successfully", data: client });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, phoneNumber } = req.body;
    const client = await createClientService(
      {
        name,
        surname,
        email,
        phoneNumber,
      },
      req.supabase
    );
    return res.status(200).json({ message: "Client created successfully" });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};
