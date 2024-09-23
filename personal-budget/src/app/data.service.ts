import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private budgetData: any[] = []; // Store fetched budget data

  constructor() {}

  getBudgetData(): Observable<any[]> {
    if (this.budgetData.length > 0) {
      return of(this.budgetData); // Return cached data if available
    } else {
      return new Observable(observer => {
        fetch('http://localhost:3000/budget')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            this.budgetData = data.myBudget; // Cache the data
            observer.next(this.budgetData);
            observer.complete();
          })
          .catch(error => {
            if (error.message !== 'NotYetImplemented') {
              console.error('Fetch error:', error);
            }
          });
      });
    }
  }
}
