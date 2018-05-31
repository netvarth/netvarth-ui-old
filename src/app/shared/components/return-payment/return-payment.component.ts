import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import {Messages} from '../../constants/project-messages';

@Component({
  selector: 'app-return-payment',
  templateUrl: './return-payment.component.html'
})
export class ReturnPaymentComponent implements OnInit {

  status = null;
  user_type = null;
  unq_id = null;
  loading = 1;

  constructor(public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private router: ActivatedRoute,
    private route: Router) {}

  ngOnInit() {

    this.router.params
    .subscribe(params => {
      this.unq_id = params.id;
      this.getPaymentStatus();

      if (!this.unq_id) {
        this.route.navigate(['/']);
      }

    });




  }

  getPaymentStatus() {
    this.shared_services.getPaymentStatus();

    this.status = 'Success'; // Success // 'Failed' // 'NoResult'
    this.user_type = 'Provider'; // Consumer// 'Provider'

    setTimeout(() => {
      this.loading = 0;
    }, 5000);
  }

}
