import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdlService } from '../cdl.service';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  user: any;
  headerName: string = ''
  loans: any;
  loansList: any;
  filter_sidebar: any;
  statusList: UntypedFormGroup;
  selectedLabels: any;
  filterapplied = false;
  statusDisplayName: any;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
  loanStatus = projectConstantsLocal.LOAN_STATUS;
  labelFilterData: any;
  filter = {
    firstName: '',
    id: '',
    lastName: '',
    date: ''
  };
  filters: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any;
  config: any;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  spInternalStatus: any;
  leadsList: any;
  leads: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private statusListFormBuilder: UntypedFormBuilder
  ) {
    this.statusList = this.statusListFormBuilder.group({
      status: [null]
    });

    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.spInternalStatus) {
        this.spInternalStatus = qparams.spInternalStatus;
      }
    });

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getLeads('ConsumerDurableLoan')
  }

  getLeads(name) {
    this.loading = true;
    const api_filter = {};
    api_filter['loanNature-eq'] = name;
    this.cdlservice.getLeadsByFilter(api_filter).subscribe((data: any) => {
      this.leadsList = data;
      this.leads = this.leadsList;
      this.pagination.totalCnt = data.length;
      this.loading = false;
    });
  }



  goBack() {
    // this.router.navigate(['provider', 'cdl']);
    this.location.back();
  }

  viewLead(uid) {
    this.router.navigate(['provider', 'cdl', 'leads', 'create', uid]);
  }
}
