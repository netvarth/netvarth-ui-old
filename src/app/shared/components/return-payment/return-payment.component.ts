import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: ActivatedRoute,
    private route: Router) { }

  ngOnInit() {

    this.router.params
      .subscribe(params => {
        this.unq_id = params.id;
        this.getPaymentStatus();

        if (!this.unq_id) {
          this.shared_functions.openSnackBar(Messages.API_ERROR, { 'panelClass': 'snackbarerror' });
          this.route.navigate(['/']);
        }

      });
  }

  getPaymentStatus() {
    this.user_type = this.shared_functions.isBusinessOwner('returntyp');
    this.shared_services.getPaymentStatus(this.user_type, this.unq_id)
      .subscribe(
        data => {
          this.status = data;
          this.status = this.status.toLowerCase();
          this.loading = 0;
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

  goBacktoHome(source) {
    setTimeout(() => {
      this.route.navigate(['/', source]);
    }, 2000);
  }
}
