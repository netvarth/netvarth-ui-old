import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { Observable } from 'rxjs';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';
import { CdlService } from './cdl.service';
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
    private router: Router,
    private http: HttpClient,
    private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);

    this.cdlservice.getJSON().subscribe(data => {
      console.log("data printed", data);
    });
  }


  CreateLoan() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  createDealer() {
    this.router.navigate(['provider', 'cdl', 'dealers', 'create']);
  }
  allLoans() {
    this.router.navigate(['provider', 'cdl', 'loans']);
  }
  allLeads() {
    this.router.navigate(['provider', 'cdl', 'loans']);
  }
  allDealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }

  requestedDealers() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'requested'
      }
    };
    this.router.navigate(['provider', 'cdl', 'dealers'], navigationExtras);
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

  getC3(): Observable<Country[]> { return this.http.get<Country[]>('./data.json') }
}

