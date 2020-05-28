import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-return-payment',
  templateUrl: './return-payment.component.html'
})
export class ReturnPaymentComponent implements OnInit {

  payment_done_success_cap = Messages.PAY_DONE_SUCCESS_CAP;
  go_back_home_cap = Messages.GO_BACK_HOME_CAP;
  payment_failed_cap = Messages.PAY_FAILED_CAP;

  status = null;
  statussmall = null;
  user_type = null;
  unq_id = null;
  loading = 1;

  constructor(public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.route.params
      .subscribe(params => {
        this.unq_id = params.id;
        // this.getPaymentStatus();
        if (!this.unq_id) {
          this.shared_functions.openSnackBar(Messages.API_ERROR, { 'panelClass': 'snackbarerror' });
          this.router.navigate(['/']);
        } else {
          const src = this.shared_functions.getitemfromLocalStorage('p_src');
          if (src === 'c_c') {
            const uuid = this.shared_functions.getitemfromLocalStorage('uuid');
            const accountId = this.shared_functions.getitemfromLocalStorage('acid');
            const navigationExtras: NavigationExtras = {
              queryParams: {
                account_id: accountId,
                pid: this.unq_id
              }
            };
            this.router.navigate(['consumer', 'checkin', 'payment', uuid], navigationExtras);
          } else if (src === 'c_d') {
            this.getPaymentStatus(src);
          } else {
            this.getPaymentStatus(src);
          }
        }

      });
  }

  getPaymentStatus(src) {
    this.user_type = this.shared_functions.isBusinessOwner('returntyp');
    this.shared_services.getPaymentStatus(this.user_type, this.unq_id)
      .subscribe(
        data => {
          this.status = data;
          this.status = this.status.toLowerCase();
          this.loading = 0;
          if (this.status === 'success') {
            this.shared_functions.openSnackBar(Messages.PAY_DONE_SUCCESS_CAP);
          } else {
            this.shared_functions.openSnackBar(Messages.PAY_FAILED_CAP, { 'panelClass': 'snackbarerror' });
          }
          if (this.user_type === 'consumer') {
            this.router.navigate(['consumer']);
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loading = 0;
        }
      );

    /*this.user_type = 'consumer';
    this.loading = 0;
    this.status = 'Success'; // Success // 'Failed' // 'NoResult'
    this.status = this.status.toLowerCase();*/

  }

  // goBacktoHome(source) {
  //   setTimeout(() => {
  //     this.route.navigate(['/', source]);
  //   }, 2000);
  // }
}
