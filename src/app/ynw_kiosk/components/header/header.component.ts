import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
@Component({
  selector: 'app-kioskheader',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() headerTitle: string;
  @Input() includedfrom: string;
  bname;
  blogo;

  constructor(
    public shared_functions: SharedFunctions,
    public router: Router,
    public shared_service: SharedServices
  ) { }

  ngOnInit() {
    this.getBusinessdetFromLocalstorage();
  }

  ngOnDestroy() {

  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromSessionStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.blogo = bdetails.logo || '';
    }
  }

}
