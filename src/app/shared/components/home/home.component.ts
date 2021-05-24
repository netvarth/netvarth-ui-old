import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { projectConstants } from '../../../app.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { projectConstantsLocal } from '../../constants/project-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public domainlist_data: any = [];
  sector_info: any = [];
  special_info: any = [];
  is_provider = 'true';
  domain_obtained = false;
  evnt;
  constructor(
    private shared_service: SharedServices,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.routerobj.navigate([projectConstantsLocal.ACCOUNTENC_ID]);
   }


  ngOnInit() {
      
      this.setSystemDate();
      // calling the method to get the list of domains
      this.getDomainList();
  }



  setSystemDate() {
    this.shared_service.getSystemDate()
      .subscribe(
        res => {
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  getDomainList() {
    const bconfig = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    let run_api = true;
    if (bconfig && bconfig.cdate && bconfig.bdata) { // case if data is there in local storage
      const bdate = bconfig.cdate;
      const bdata = bconfig.bdata;
      const saveddate = new Date(bdate);
      if (bconfig.bdata) {
        const diff = this.dateTimeProcessor.getdaysdifffromDates('now', saveddate);
        if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
          run_api = false;
          this.domainlist_data = bdata;
          // this.domainlist_data = ddata.bdata;
          this.domain_obtained = true;
        }
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            this.domainlist_data = res;
            this.domain_obtained = true;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.domainlist_data
            };
            this.lStorageService.setitemonLocalStorage('ynw-bconf', postdata);
          }
        );
    }
  }
}

