
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnChanges, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedFunctions } from '../../functions/shared-functions';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { Messages } from '../../constants/project-messages';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-sales-channel-code',
  templateUrl: './sales-channel-code.component.html'
})
export class SalesChannelCodeComponent implements OnInit {
  salescode = false;
  sccode;
  hearus;
  phonenumber;
  ifsomeone = false;
  txtarea = false;
  exmle: any;

  @Input() scOtp;
  myotp: any;
  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
    console.log(this.scOtp)
  }
  handleSalescode() {
 this.salescode = true;
  }
  handlekeyup(ev) { 
    if (ev.keyCode == 13) {
      this.txtarea = true;
      this.searchScdetails(this.sccode);
    }
    else{
      this.txtarea = false;
    }
  }
  handlePhoneno(ev){
    if (ev.keyCode == 13) {
      this.searchPhonedetails(this.phonenumber);
    }
  }
  searchScdetails(sccode) {
    this.provider_services.getSearchSCdetails(sccode)
    .subscribe(
      data => {
        console.log(data)
      },
      () => {
       
      }
    );
  }

searchPhonedetails(phonenumber) {
    this.provider_services.getsearchPhonedetails(phonenumber)
    .subscribe(
      data => {
        console.log(data)
      },
      () => {
       
      }
    );
  }
  // saveHere1(){
  //   console.log(this.hearus);
  // }

  saveHere(){
    this.myotp=this.scOtp;
    const post_data = {
      'hereby': this.hearus,
      'scCode': this.sccode,
  };
    this.provider_services.saveHere(post_data,this.myotp)
    .subscribe(
      data => {
        
      },
      () => {
       
      }
    );
  }
 



}
