import { TestBed } from '@angular/core/testing';

import { ExportReportService } from './export-report.service';

describe('ExportReportService', () => {
  let service: ExportReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
