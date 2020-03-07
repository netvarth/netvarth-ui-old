import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderBprofileSearchAdwordsComponent } from '../add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-bprofile-search-adwords',
  templateUrl: './provider-bprofile-search-adwords.component.html',
  styleUrls: ['./provider-bprofile-search-adwords.component.css']
})
export class ProviderBprofileSearchAdwordsComponent implements OnInit, OnChanges, OnDestroy {

  adwords_cap = Messages.SEARCH_ADWORDS_CAP;
  sorry_cap = Messages.SEARCH_SORRY_CAP;
  not_have_any_adwords_msg = Messages.SEARCH_NOT_HAVE_ANY_ADWORD_MSG;

  adword_list: any = [];
  showadword_list: any = [];
  adwordsmaxcount: any = 0;
  remaining_adword = 0;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  query_executed = false;
  addwordTooltip = '';
  adwords_mincnt = 5;
  adwords_cntr = 0;
  startpageval = 1;
  perpage = 5;
  adwordshowmore = false;
  emptyMsg = this.sharedfunctionObj.getProjectMesssages('ADWORD_LISTEMPTY');
  remadwdialogRef;
  adwdialogRef;
  active_user;

  customer_label = '';
  frm_adword_cap = '';
  domain;

  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private shared_functions: SharedFunctions,
    private routerobj: Router,
    private sharedfunctionObj: SharedFunctions) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.addwordTooltip = this.sharedfunctionObj.getProjectMesssages('ADDWORD_TOOLTIP');
    this.getTotalAllowedAdwordsCnt();
    this.frm_adword_cap = Messages.FRM_LEVEL_PROVIDER_LIC_ADWORDS_MSG.replace('[customer]', this.customer_label);
  }

  ngOnChanges() {
    this.getTotalAllowedAdwordsCnt();
  }

  ngOnDestroy() {
    if (this.remadwdialogRef) {
      this.remadwdialogRef.close();
    }
    if (this.adwdialogRef) {
      this.adwdialogRef.close();
    }
  }

  private pass_totalpages() {
    return this.adword_list.length;
  }
  private pass_pagesize() {
    return this.perpage;
  }
  private handle_pageclick(pg) {
    this.startpageval = pg;
    let passstartval = 0;
    if (this.startpageval) {
      passstartval = (this.startpageval - 1) * this.perpage;
    } else {
      passstartval = 0;
    }
    this.showAdwordBuilder(passstartval);
    // this.do_search();
  }
  getTotalAllowedAdwordsCnt() {
    this.provider_servicesobj.getTotalAllowedAdwordsCnt()
      .subscribe((data: any) => {

        this.adwordsmaxcount = data;
        this.getAdwords();
      });
  }
  getAdwordDisplayName(name) {
    return name.split(projectConstants.ADWORDSPLIT).join(' ');
  }
  getAdwords() {
    this.provider_servicesobj.getAdwords()
      .subscribe(data => {
        this.adword_list = data;
        this.remaining_adword = this.adwordsmaxcount - this.adword_list.length;
        this.showAdwordBuilder(0);
        this.startpageval = 1;
        this.query_executed = true;
      });
  }
  addAdwords() {
    if (this.remaining_adword > 0) {
      this.adwdialogRef = this.dialog.open(AddProviderBprofileSearchAdwordsComponent, {
        width: '50%',
        data: {
          type: 'add'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });

      this.adwdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          this.getAdwords();
        }
      });
    } else {
      this.sharedfunctionObj.openSnackBar(Messages.ADWORD_EXCEED_LIMIT, { 'panelClass': 'snackbarerror' });
    }

  }
  doRemoveAdwords(adword) {
    const id = adword.id;
    if (!id) {
      return false;
    }
    this.remadwdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('ADWORD_DELETE').replace('[adword]', '"' + adword.name.replace(/__/g, ' ') + '"')
      }
    });
    this.remadwdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAdwords(id);
      }
    });
  }
  deleteAdwords(id) {
    this.provider_servicesobj.deleteAdwords(id)
      .subscribe(
        () => {
          this.getAdwords();
          this.sharedfunctionObj.openSnackBar(Messages.ADWORD_DELETE_SUCCESS);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  toggle_adwordshowmore() {
    if (this.adwordshowmore) {
      this.adwordshowmore = false;
    } else {
      this.adwordshowmore = true;
    }
  }
  showAdwordBuilder(startval) {
    this.showadword_list = [];
    const rLimit = ((startval + this.perpage) > this.adword_list.length) ? this.adword_list.length : (startval + this.perpage);
    for (let i = startval; i < rLimit; i++) {
      this.showadword_list.push(this.adword_list[i]);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/license->' + mod]);
    // this.routerobj.navigate(['/provider/learnmore/license->' + mod]);
    // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    // this.sharedfunctionObj.sendMessage(pdata);
}
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'license', 'subKey': mod };
  //   return moreOptions;
  // }
}
