import { Request, Response } from "express";
import { getCarPartsService } from "../services/carPart-service";

export const GetCarParts = async (req: Request, res: Response) => {
  const carParts = await getCarPartsService(req.supabase);
  res
    .status(200)
    .json({ message: "Car parts fetched successfully", data: carParts });
};
