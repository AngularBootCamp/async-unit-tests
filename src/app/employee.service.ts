import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { Employee } from './employee';

const apiUrl = 'https://api.angularbootcamp.com';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getDelayedList(): Observable<string[]> {
    return this.http.get<Employee[]>(apiUrl + '/employees').pipe(
      delay(2000), // this will force us to test asynchronously
      map(employees => employees.map(e => e.first_name)),
      map(names => names.sort()),
      catchError(err => {
        console.error('handling error within getEmployees()', err);
        const fakeData = ['no employees could be loaded'];
        return of(fakeData);
      })
    );
  }

  getFilteredList(searchText: string): Observable<Employee[]> {
    const params = new HttpParams()
      .set('q', searchText)
      .set('_limit', '20');

    return this.http.get<Employee[]>(apiUrl + '/employees', {
      params
    });
  }
}
