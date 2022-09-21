import { Component, OnInit } from '@angular/core';
import {  Router,NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  user: any;
  statusLoansList:any=[
    {
      'loanId':101,
      'CustomerName':'David',
      'Dealer':'Venus',
      'status':'Approved'
    },
    {
      'loanId':102,
      'CustomerName':'Aswin',
      'Dealer':'Mg',
      'status':'Approved'
    },
    {
      'loanId':103,
      'CustomerName':'Atul',
      'Dealer':'Asian Choice',
      'status':'Approved'
    },
    {
      'loanId':104,
      'CustomerName':'Davika',
      'Dealer':'T Mobiles',
      'status':'Approved'
    },
    {
      'loanId':105,
      'CustomerName':'Babu',
      'Dealer':'T Mobiles',
      'status':'Approved'
    },
  ]
  headerName:string=''
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    // console.log("User is", this.user);
    // console.log(this.router);
    this.activated_route.queryParams.subscribe((params)=>{
      // console.log(params);
      if(params){
        if(params && (params.type==='approvedLoans')){
          let tempHeaderName: string = ''
          tempHeaderName = params.type.substring(0, 8) + " " + params.type.substring(8);
          if(tempHeaderName){
            this.headerName = tempHeaderName;
          }
          
        }
        else if(params && (params.type==='allLoans')){
          let tempHeaderName: string = ''
          tempHeaderName = params.type.substring(0, 3) + " " + params.type.substring(3);
          if(tempHeaderName){
            this.headerName = tempHeaderName;
          }
          console.log('jj')
          console.log(' this.statusLoansList', this.statusLoansList);
          const statusListLengthLoan=this.statusLoansList.length;
          console.log('statusListLengthLoan',statusListLengthLoan)
          this.statusLoansList[4]['status']='Pending';
        }
        else{
          this.headerName= params.type;
          return this.headerName;
        }
       
      }
    })
    
  }
  goBack(){
    this.location.back();
  }
  loanDetails(data){
    console.log(data);
    const status= data['status'];
    const customerName=data['CustomerName']
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'loanDetails',
          status:status,
          customerName:customerName
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans','loanDetails'],navigationExtras);
  }

}
