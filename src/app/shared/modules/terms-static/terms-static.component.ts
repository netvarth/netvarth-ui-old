import { Component, Inject, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-terms-static',
  templateUrl: './terms-static.component.html'
})
export class TermsStaticComponent implements OnInit {

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
     // console.log('passedid', passid);
    //  if (passid) {
    //   if (passid === 'mobile') {
    //     this.showheaderandfooter = false;
    //   }  else {
    //     this.showheaderandfooter = true;
    //   }
    // } else {
      // this.showheaderandfooter = true;
    // }
    this.showheaderandfooter = false;
    });
  }
}
