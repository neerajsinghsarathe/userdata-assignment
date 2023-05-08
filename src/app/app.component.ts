import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'userdata';
  data: any[] = [];
  employeeDetails: any[] = [];
  public chart: any;
  uniqueNames: any[] = [];

  constructor(private httpClient: HttpClient) {
    this.getData().subscribe((res: any) => {
      this.data = res;
      this.uniqueNames = [
        ...new Set(this.data.map((item) => item.EmployeeName)),
      ];
      this.getUsersData(this.uniqueNames);
    });
  }

  createChart(empName: any) {
    let workedHours = this.employeeDetails.find(
      (emp) => emp.name == empName.target.value
    );
    console.log(workedHours);

    if (typeof this.chart == 'object') {
      this.chart.destroy();
    }
    this.chart = new Chart('MyChart', {
      type: 'pie',

      data: {
        labels: ['Total Hours Worked', 'Total Remaining Hours'],
        datasets: [
          {
            label: empName.target.value,
            data: [
              (workedHours.duration * 100) / 100,
              100 - (workedHours.duration * 100) / 100,
            ],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  getUsersData(unique: any[]) {
    unique.map((name) => {
      if (name != null) {
        const details = this.data.filter(
          (userDetail) => userDetail.EmployeeName == name
        );
        const dates = details.map((entry) => ({
          startTime: new Date(entry.StarTimeUtc),
          endTime: new Date(entry.EndTimeUtc),
        }));
        const totalDuration = dates.reduce(
          (total, date) =>
            total + (date.endTime.getTime() - date.startTime.getTime()),
          0
        );
        const totalHours =
          Math.round((totalDuration / (1000 * 60 * 60)) * 100) / 100;
        this.employeeDetails.push({
          name: name,
          duration: totalHours,
        });
      }
    });
  }

  getData() {
    return this.httpClient.get(
      'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ=='
    );
  }
}
