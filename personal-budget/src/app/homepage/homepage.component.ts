import { AfterViewInit, Component, Inject, Injectable, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ArticleComponent } from "../article/article.component";
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto'
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
@Injectable({providedIn: 'root'})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [] as string[],
        borderColor: [] as string[],
        borderWidth: 1
      }
    ]
  };

  constructor(private httpClient: HttpClient, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    fetch('http://localhost:3000/budget')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res: any) => {
        const myBudgetData = res?.myBudget;
        if (myBudgetData && Array.isArray(myBudgetData)) {
          this.dataSource.labels = [];
          this.dataSource.datasets[0].data = [];
          this.dataSource.datasets[0].backgroundColor = [];
          this.dataSource.datasets[0].borderColor = [];

          for (let item of myBudgetData) {
            this.dataSource.datasets[0].data.push(item.budget);
            this.dataSource.labels.push(item.title);
            this.dataSource.datasets[0].backgroundColor.push(item.color);
            this.dataSource.datasets[0].borderColor.push(item.borderColor);
          }
          this.createChart();
        } else {
          console.error('No budget data found.');
        }
      })
      .catch(error => {
        if (error.message !== 'NotYetImplemented') {
          console.error('Fetch error:', error);
        }
      });

  }


  createChart() {
    const ctx = (this.document.getElementById('myChart') as HTMLCanvasElement | null);
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: this.dataSource,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    } else {
      console.error('Failed to get context for the canvas.');
    }
  }


}
