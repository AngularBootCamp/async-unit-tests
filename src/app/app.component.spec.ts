import SpyObj = jasmine.SpyObj;

import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { EmployeeService } from './employee.service';
import { employees } from './test-data';

describe('App Component', () => {
  let appComponent: AppComponent;
  let employeeService: SpyObj<EmployeeService>;

  beforeEach(() => {
    employeeService = jasmine.createSpyObj<EmployeeService>(
      'EmployeeService',
      ['getFilteredList']
    );
  });

  describe('filtered team list (manual asynchronous testing with fakeAsync)', () => {
    it('should respond to user typing after 250 ms', fakeAsync(() => {
      employeeService.getFilteredList.and.returnValue(of(employees));
      appComponent = new AppComponent(employeeService);

      appComponent.filteredTeam
        .pipe(take(1))
        .subscribe(team => expect(team).toEqual(employees));

      appComponent.nameFilter.setValue('Henry');
      expect(employeeService.getFilteredList).not.toHaveBeenCalled();
      tick(249);
      expect(employeeService.getFilteredList).not.toHaveBeenCalled();
      tick(1);
      expect(employeeService.getFilteredList).toHaveBeenCalledTimes(
        1
      );
    }));

    it('should only make one call, 250ms after last typing', fakeAsync(() => {
      employeeService.getFilteredList.and.returnValue(of(employees));
      appComponent = new AppComponent(employeeService);

      appComponent.filteredTeam
        .pipe(take(1))
        .subscribe(team => expect(team).toEqual(employees));

      appComponent.nameFilter.setValue('Henry');
      expect(employeeService.getFilteredList).not.toHaveBeenCalled();
      tick(249);
      expect(employeeService.getFilteredList).not.toHaveBeenCalled();
      appComponent.nameFilter.setValue('Bob');
      tick(249);
      expect(employeeService.getFilteredList).not.toHaveBeenCalled();
      tick(1);
      expect(employeeService.getFilteredList).toHaveBeenCalledTimes(
        1
      );
      expect(
        employeeService.getFilteredList.calls.mostRecent().args
      ).toEqual(['Bob']);
    }));
  });
});
