import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SubSink } from '../../../../../node_modules/subsink';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  private subs = new SubSink();
  constructor(private location: Location,
    public shared_functions: SharedFunctions,
    public router: Router) { 
    
  }

  ngOnInit(): void {
  }
  goBack () {
    this.location.back();
  }
  gotoJaldeeCashdetails(){
    console.log('in ')
    this.router.navigate(['consumer', 'mywallet', 'jaldee-cash']);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
