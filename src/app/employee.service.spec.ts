import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';

import { Employee } from './employee';
import { EmployeeService } from './employee.service';

describe('Employee Service', () => {
  let httpTestingController: HttpTestingController;
  let service: EmployeeService;
  let testData: Array<Partial<Employee>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(EmployeeService);

    testData = [
      {
        first_name: 'Sara'
      },
      {
        first_name: 'Joe'
      },
      {
        first_name: 'Bob'
      }
    ];
  });

  // FLAKY TEST / FALSE POSITIVE!!! This test sometimes passes and sometimes fails
  // because the incorrect assertion in the subscribe only gets executed
  // if the overall test run is long enough.
  // If you change the xit to it, the test will probably fail.
  // If you change the xit to fit, the test will probably pass.
  xit('should return a delayed list (false positive)(the wrong way)', () => {
    service.getDelayedList().subscribe(data => {
      // This line may not get executed before the test finishes!!!
      expect(data).toEqual(['Bob', 'Joe', 'foo']);
    });

    const req = httpTestingController.expectOne('/api/employees');

    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    httpTestingController.verify();
  });

  // Wrapping the test in Angular's async function ensures that the
  // expectation in the subscribe gets executed in the scope of the test.
  // If you change the data in the expected array, the test will fail as expected.
  it('should return a delayed list (the right way)', async(() => {
    service.getDelayedList().subscribe(data => {
      expect(data).toEqual(['Bob', 'Joe', 'Sara']);
    });

    const req = httpTestingController.expectOne('/api/employees');

    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    httpTestingController.verify();
  }));
});
