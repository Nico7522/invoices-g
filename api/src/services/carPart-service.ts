import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import { CarPart } from "../models/carPart";

export const getCarPartsService = async (
  supabase: ReturnType<typeof getAuthClient>
): Promise<CarPart[]> => {
  const { data, error } = await supabase.from("car_parts").select("*");

  if (error) {
    throw new CustomError({
      type: "about:blank",
      title: error.name,
      detail: error.message || "Error fetching car parts",
      instance: "/api/carParts",
      status: 400,
    });
  }
  return data.map((carPart) => ({
    id: carPart.id,
    name: carPart.name,
    price: carPart.price,
  }));
};
