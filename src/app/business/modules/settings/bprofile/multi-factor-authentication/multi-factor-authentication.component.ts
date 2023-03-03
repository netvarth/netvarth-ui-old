import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-multi-factor-authentication',
  templateUrl: './multi-factor-authentication.component.html',
  styleUrls: ['./multi-factor-authentication.component.css']
})

export class MultiFactorAuthenticationComponent implements OnInit {
  multiFactorAuthentication: any;
  multiFactorAuthenticationStr = 'Off';
  multiFactorAuthenticationstatus: any;
  multiFactorAuthenticationstatusstr: string;
  accountActiveMsg = '';
  cust_domain_name = '';
  customer_label = '';
  domain;
  constructor(private router: Router,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  ngOnInit() {
    this.getMfaSettings();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
  }
  getMfaSettings() {
    this.provider_services.getAccountSetting().subscribe(
      (data: any) => {
        this.multiFactorAuthentication = data.multiFactorAuthenticationRequired;
        this.multiFactorAuthenticationstatusstr = (this.multiFactorAuthentication) ? 'On' : 'Off';
      }
    );
  }
  handle_mfa(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';

    this.provider_services.handleMultiFactorAuthentication(is_check)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar('Multi Factor Authentication ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getMfaSettings();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getMfaSettings();
        }
      );
  }
  redirecToProfile() {
    this.router.navigate(['provider', 'settings']);
  }
}
