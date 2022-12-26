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
  rateOfInterest: any;
  totalRepaymentAmount: any;
  totalInterestAmount: any;
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
          data: [this.loanAmount, this.totalInterestAmount],
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
    this.monthlyInterest = this.interestRate / 12 / 100;
    this.rateOfInterest = Math.pow(1 + this.monthlyInterest, this.loanTenure);
    this.EmiPayment = ((this.loanAmount * this.monthlyInterest * this.rateOfInterest) / (this.rateOfInterest - 1)).toFixed(2);
    this.totalRepaymentAmount = (this.EmiPayment * this.loanTenure).toFixed(2);
    this.totalInterestAmount = (this.totalRepaymentAmount - this.loanAmount).toFixed(2)
    this.getPieChartData();
  }

  goBack() {
    this.location.back();
  }

}
