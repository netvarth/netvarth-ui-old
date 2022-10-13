import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../cdl.service';


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  user: any;
  headerName: string = ''
  loans: any;
  loansList: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getLoans()

  }

  updateLoan(id, action) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        action: action
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
  }

  getLoans() {
    this.cdlservice.getLoans().subscribe((data) => {
      this.loansList = data;
      if (this.loansList) {
        this.activated_route.queryParams.subscribe((params) => {
          if (params) {
            if (params && (params.type === 'approved')) {
              this.headerName = "Approved Loans";
            }
            else if (params && (params.type === 'redirected')) {
              this.headerName = "Redirected Loans";
            }
            else if (params && (params.type === 'rejected')) {
              this.headerName = "Rejected Loans";
            }
            else {
              this.headerName = "All Loans";
            }

          }

          else {
            this.headerName = params.type;
            return this.headerName;
          }


          if (params.type && params.type != 'all') {
            this.loans = this.loansList.filter(i => i.status == params.type)
            console.log("Loans List : ", this.loans);
          }
          else {
            this.loans = this.loansList;
          }

        });
      }
      console.log("Loans List : ", this.loansList);

    })
  }



  goBack() {
    this.location.back();
  }

  loanDetails(id) {
    this.router.navigate(['provider', 'cdl', 'loans', id]);
  }

}
