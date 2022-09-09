import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class POSComponent implements OnInit {
  customer_label = '';
  pos_status = false;
  pos_statusstr = 'Off';
  frm_public_self_cap = '';
  domain;
  nodiscountError = false;
  noitemError = false;
  itemError = '';
  discountError = '';
  discount_list;
  discount_count = 0;
  item_list;
  item_count = 0;
  constructor(private router: Router,
    private routerobj: Router,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private commonDataStorage: CommonDataStorageService,
    private groupService: GroupStorageService) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getPOSSettings();
    this.getDiscounts();
    this.getitems();
  }

  getDiscounts() {
    this.provider_services.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.discount_count = this.discount_list.length;
        this.nodiscountError = true;
      },
        (error) => {
          this.discountError = error;
          this.nodiscountError = false;
        }
      );
  }

  getitems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.item_count = this.item_list.length;
        this.noitemError = true;
      },
        (error) => {
          this.itemError = error;
          this.noitemError = false;
        });
  }
  gotoItems() {
    if (this.noitemError) {
      this.router.navigate(['provider', 'settings', 'pos', 'items']);
    } else {
      this.snackbarService.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoDiscounts() {
    if (this.nodiscountError) {
      this.router.navigate(['provider', 'settings', 'pos', 'discount']);
    } else {
      this.snackbarService.openSnackBar(this.discountError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoCoupons() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
  }
  handle_posStatus(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    this.provider_services.setProviderPOSStatus(value).subscribe(data => {
      this.snackbarService.openSnackBar('Billing settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.commonDataStorage.setSettings('pos', null);
      this.getPOSSettings();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getPOSSettings();
    });
  }
  getPOSSettings() {
    this.provider_services.getProviderPOSStatus().then(data => {
      this.pos_status = data['enablepos'];
      this.pos_statusstr = (this.pos_status) ? 'On' : 'Off';
    });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
  }
}
