import { TestBed } from '@angular/core/testing';

import { PlateformService } from './plateform.service';

describe('PlateformService', () => {
  let service: PlateformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlateformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
