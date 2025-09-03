import { Injectable } from '@angular/core';
import { CarPart } from '../../models/cart-part-interface';
import { httpResource } from '@angular/common/http';
import { carPartSchema } from '../../schemas/car-part-schema';

@Injectable({
  providedIn: 'root',
})
export class GetCarPartsService {
  getCarParts() {
    return httpResource<CarPart[]>(() => 'api/car-parts', {
      defaultValue: [] as CarPart[],
      parse: (response) => {
        return carPartSchema.array().parse((response as { data: CarPart[] }).data);
      },
    });
  }
}
