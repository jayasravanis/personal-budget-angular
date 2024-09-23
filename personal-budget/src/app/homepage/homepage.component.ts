import { AfterViewInit, Component, Inject } from '@angular/core';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../data.service';
import { ArticleComponent } from "../article/article.component";
import { BreadcrumbsComponent } from "../breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'pb-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [ArticleComponent, BreadcrumbsComponent]
})
export class HomepageComponent implements AfterViewInit {

  private svg: any;
  private margin = 20;
  private width = 400;
  private height = 400;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

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

  constructor(private dataService: DataService, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.dataService.getBudgetData().subscribe({
      next: (myBudgetData) => {
        if (myBudgetData && Array.isArray(myBudgetData)) {
          this.dataSource.labels = [];
          this.dataSource.datasets[0].data = [];
          this.dataSource.datasets[0].backgroundColor = [];
          this.dataSource.datasets[0].borderColor = [];

          for (let item of myBudgetData) {
            this.dataSource.datasets[0].data.push(item.budget);
            this.dataSource.labels.push(item.title);
            this.dataSource.datasets[0].backgroundColor.push(item.color); // Use item.color directly
            this.dataSource.datasets[0].borderColor.push(item.borderColor); // If borderColor is present
          }
          this.createChart();
          this.createSvg();
          this.drawChart(myBudgetData); // Pass the budget data to the drawChart method
        } else {
          console.error('No budget data found.');
        }
      },
      error: (err) => {
        console.error('Error occurred while fetching budget data:', err);
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

  private createSvg(): void {
    this.svg = d3.select("#d3-chart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  }

  private drawChart(myBudgetData: any[]): void {
    // Use the budget colors directly from the data
    const colors = d3.scaleOrdinal()
      .domain(myBudgetData.map(d => d.title))
      .range(myBudgetData.map(d => d.color)); // Map colors from budget data

    const pie = d3.pie<any>().value((d: any) => d.budget);

    this.svg
      .selectAll('pieces')
      .data(pie(myBudgetData))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any) => colors(d.data.title)) // Use title for color mapping
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(myBudgetData))
      .enter()
      .append('text')
      .text((d: any) => d.data.title)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }

}
