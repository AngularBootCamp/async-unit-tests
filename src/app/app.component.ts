import { NgFor, AsyncPipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';

import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, AsyncPipe, JsonPipe]
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
