import { Component, OnInit } from '@angular/core';
// import {  Router,NavigationExtras } from '@angular/router';
// import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loanDetails',
  templateUrl: './loanDetails.component.html',
  styleUrls: ['./loanDetails.component.css']
})
export class loanDetailsComponent implements OnInit {
    headerName:string=''
    customerName:string=''
    customerphNo:string=''
    employeeEmail: string='';
    employeeMartialStatus: string='';
    employeephNo: string='';
    employeeEmployeeTYpe: string='';
    employeeSalary: number;
    employeeOffAdd: string='';
    employeeCityWork: string='';
    employeeREsidence: string='';
    employeeHomeAdd: string='';
    adharNumber: number;
    panCardNumber: string='';
    accountNumber: string='';
    IFSCCode: string='';
    bankName: string='';
    emiPaidNo: number;
    cibilScore:number;
    mafilScore:number;
    perfiosScore:number;
    totalScore:number;
    loanStatus:string='';
    paramsValue:any;
    constructor(
    //     private groupService: GroupStorageService,
    // private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    ){}
    ngOnInit(): void {
        this.activated_route.queryParams.subscribe((params) => {
            console.log('params',params);
            if (params) {
                this.paramsValue=params;
                if (params && params.type && params.type === 'loanDetails') {
                    let tempHeaderName: string = ''
                    tempHeaderName = params.type.substring(0, 4) + " " + params.type.substring(4);
                    if (tempHeaderName) {
                        this.headerName = tempHeaderName;
                    }
                    this.personalDetails()

                }
            }
        })
    }
    personalDetails(){
        if(this.paramsValue && this.paramsValue.customerName){
            this.customerName=this.paramsValue.customerName
        }
        this.employeephNo='+919633360166';
        this.employeeEmail=this.customerName.toLowerCase()+'@gmail.com';
        this.employeeMartialStatus='Married';
        this.employeeEmployeeTYpe='Salaried';
        this.employeeSalary=440000;
        this.employeeOffAdd='Thrissur';
        this.employeeCityWork='Thrissur';
        this.employeeREsidence='Thrissur';
        this.employeeHomeAdd='Thrissur';
        this.adharNumber=5454545545454544;
        this.panCardNumber='545454554gasd';
        this.accountNumber='5454545545454544';
        this.IFSCCode='KOTAKSDA12F';
        this.bankName='KODAK';
        this.emiPaidNo=2;
        this.cibilScore=250;
        this.mafilScore=200;
        this.totalScore=440;
        this.perfiosScore=120;
        if(this.paramsValue && this.paramsValue.status){
            this.loanStatus=this.paramsValue.status;
        }


    }
    goBack(){
        this.location.back();
    }
    viewKycDetails(kycType,kycInfo){
        if(kycType && kycType==='addhar'){
            return false;
        }
        else if(kycType && kycType==='panCard'){
            return false;
        }
    }
}