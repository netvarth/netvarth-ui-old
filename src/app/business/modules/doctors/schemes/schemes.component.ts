import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CdlService } from '../cdl.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

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
    private location: Location,
    private cdlservice: CdlService,
    private lStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
    this.partnerId = this.lStorageService.getitemfromLocalStorage('partnerId');
    this.getSchemes()

  }

  getSchemes() {
    this.loading = true;
    this.cdlservice.getSchemes().subscribe((data) => {
      this.schemeList = data;
      this.loading = false;
      console.log("this.schemelist", this.schemeList)
    })
  }


  goBack() {
    this.location.back();
  }


}

