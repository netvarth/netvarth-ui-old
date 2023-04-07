import { Component, OnInit } from '@angular/core';
// import { Location } from '@angular/common';
import { CdlService } from '../../cdl.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-equifax',
  templateUrl: './equifax.component.html',
  styleUrls: ['./equifax.component.css']
})
export class EquifaxComponent implements OnInit {
  loading: any = false;
  equifaxList: any;
  constructor(
    // private location: Location,
    private cdlService: CdlService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEquifax();
  }

  goBack() {
    this.router.navigate(['provider', 'cdl']);
    // this.location.back();
  }

  getEquifax() {
    this.cdlService.getEquifaxByFilter().subscribe((data: any) => {
      this.equifaxList = data;
    });
  }

  convertToLoan(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'equifax',
        equifaxId: id
      }
    }
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

  checkEquifax() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        src: 'equifax'
      }
    };
    this.router.navigate(['provider', 'cdl', 'equifax', 'checkequifax'], navigationExtras);
  }




}
