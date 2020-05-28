import { TestBed } from '@angular/core/testing';

import { PreviousUrlHolderService } from './previous-url-holder.service';

describe('PreviousUrlHolderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreviousUrlHolderService = TestBed.get(PreviousUrlHolderService);
    expect(service).toBeTruthy();
  });
});
