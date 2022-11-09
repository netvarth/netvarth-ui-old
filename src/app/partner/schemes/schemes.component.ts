import { Component, OnInit } from '@angular/core';
// import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { GroupStorageService } from '../../shared/services/group-storage.service';
// import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { PartnerService } from '../partner.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.css']
})
export class SchemesComponent implements OnInit {
  user: any;
  headerName: string = ''
  loans: any;
  schemeList: any;
  filter_sidebar: any;
  selectedLabels: any;
  filterapplied = false;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
  labelFilterData: any;
  filter = {
    firstName: '',
    id: '',
    lastName: '',
    date: ''
  };
  partnerId: any;
  partnerParentId: any;
  filters: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any;

  constructor(
    private groupService: GroupStorageService,
    // private router: Router,
    private location: Location,
    // private activated_route: ActivatedRoute,
    private partnerservice: PartnerService,
    private lStorageService: LocalStorageService,
    // private dateTimeProcessor: DateTimeProcessor
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
    this.partnerId = this.lStorageService.getitemfromLocalStorage('partnerId');
    this.getSchemes()

  }

  getSchemes() {
    this.loading = true;
    this.partnerservice.getSchemes().subscribe((data) => {
      this.schemeList = data;
      console.log("this.schemelist", this.schemeList);
      this.loading = false;
    })
  }


  goBack() {
    this.location.back();
  }


}

