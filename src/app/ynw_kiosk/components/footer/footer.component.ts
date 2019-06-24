import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-kioskfooter',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit, OnDestroy {

  provider_loggedin = false;

  constructor(
    public shared_functions: SharedFunctions,
    public router: Router,
    public shared_service: SharedServices
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
