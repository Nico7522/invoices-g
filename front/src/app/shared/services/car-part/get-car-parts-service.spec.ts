import { TestBed } from '@angular/core/testing';

import { GetCarPartsService } from './get-car-parts-service';

describe('GetCarPartsService', () => {
  let service: GetCarPartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCarPartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
