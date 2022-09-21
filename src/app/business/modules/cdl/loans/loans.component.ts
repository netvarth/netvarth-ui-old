import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
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
  approvedLoans:any[]=[
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
    console.log("User is", this.user);
    console.log(this.router);
    this.activated_route.queryParams.subscribe((params)=>{
      console.log(params);
      if(params){
        if(params && (params.type==='approvedLoans')){
          let tempHeaderName: string = ''
          tempHeaderName = params.type.substring(0, 8) + " " + params.type.substring(8);
          console.log('2nd',tempHeaderName);
          this.headerName = tempHeaderName
          return this.headerName;
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

}
