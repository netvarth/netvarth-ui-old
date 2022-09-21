import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';

@Component({
  selector: 'app-cdl',
  templateUrl: './cdl.component.html',
  styleUrls: ['./cdl.component.css']
})
export class CdlComponent implements OnInit {
  user: any;
  customOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    navSpeed: 200,
    dots: true,
    center: true,
    checkVisible: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      700: {
        items: 1
      },
      970: {
        items: 1
      }
    }
  }

  constructor(
    private groupService: GroupStorageService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
  }


  CreateLoan() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  createDealer() {
    this.router.navigate(['provider', 'cdl', 'dealers', 'create']);
  }

  ApprovedLoans() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'approvedLoans'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
    // this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
  }
  allLoans(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'allLoans'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'],navigationExtras);
  }
}

