import { TestBed } from '@angular/core/testing';

import { RecipeRateService } from './recipe-rate.service';

describe('RecipeRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeRateService = TestBed.get(RecipeRateService);
    expect(service).toBeTruthy();
  });
});
