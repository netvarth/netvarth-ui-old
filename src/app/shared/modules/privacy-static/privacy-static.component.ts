import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy-static',
  templateUrl: './privacy-static.component.html'
})
export class PrivacyStaticComponent implements OnInit {

  kwdet: any = [];
  api_error = null;
  domain;
  showheaderandfooter = false;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
  ) {
  }

  ngOnInit() {
    this.activaterouterobj.paramMap
      .subscribe(params => {
        const passid = params.get('id');
        if (passid) {
          if (passid === 'mobile') {
            this.showheaderandfooter = false;
          } else {
            this.showheaderandfooter = true;
          }
        } else {
          this.showheaderandfooter = true;
        }
      });
  }
}
