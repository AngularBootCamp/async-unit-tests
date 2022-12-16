import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';

import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  nameFilter = new FormControl('', { nonNullable: true });
  filteredTeam: Observable<Employee[]>;

  constructor(sw: EmployeeService) {
    this.filteredTeam = this.nameFilter.valueChanges.pipe(
      startWith(this.nameFilter.value as string),
      debounceTime(250),
      switchMap(x => sw.getFilteredList(x))
    );
  }
}
