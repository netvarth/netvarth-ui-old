import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../shared/services/group-storage.service';
import { PartnerService } from '../partner.service';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  config: any;
  customers: any;
  user: any;
  loading: any = false;
  partnerParentId: any;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  constructor(
    private partnerService: PartnerService,
    private groupService: GroupStorageService,
    private location: Location,
    private lStorageService: LocalStorageService,
    private router: Router
  ) {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
    this.getCustomers();
  }

  getCustomers() {
    this.loading = true;
    this.partnerService.getPartnerCustomers(this.user.partnerId).subscribe((data: any) => {
      this.customers = data;
      this.pagination.totalCnt = data.length;
      this.loading = false;
    })
  }

  goBack() {
    this.location.back()
  }

  goBackToHome() {
    this.router.navigate([this.partnerParentId, 'partner']);
  }


}
