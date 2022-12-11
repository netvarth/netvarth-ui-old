import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-emi-calci',
  templateUrl: './emi-calci.component.html',
  styleUrls: ['./emi-calci.component.scss']
})
export class EmiCalciComponent implements OnInit {

  loanAmount: any = 5000;
  interestRate: any = 8;
  loanTenure: any = 6;
  monthlyInterest: any = 0;
  EmiPayment: any = 0;
  pieChartOptions: any;
  pieChartData: any;
  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    this.calculateEmi();
    this.getPieChartData();
  }

  getPieChartData() {
    this.pieChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079'
          }
        }
      }
    };


    this.pieChartData = {
      labels: ['Loan Amount', 'Interest'],
      datasets: [
        {
          data: [this.loanAmount, this.monthlyInterest * this.loanTenure],
          backgroundColor: [
            "orange",
            "#3CB698"
          ],
          hoverBackgroundColor: [
            "#64B5F6",
            "#64B5F6"
          ]
        }
      ]
    };
  }

  calculateEmi() {
    console.log(this.loanAmount, this.interestRate, this.EmiPayment)
    this.monthlyInterest = (this.loanAmount * (this.interestRate * 0.01)) / this.loanTenure;
    this.EmiPayment = ((this.loanAmount / this.loanTenure) + this.monthlyInterest).toFixed(2);
    console.log(this.monthlyInterest, this.EmiPayment);
    this.getPieChartData();
  }

  goBack() {
    this.location.back();
  }

}
