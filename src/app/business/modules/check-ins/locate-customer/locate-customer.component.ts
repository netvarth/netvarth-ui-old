import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
@Component({
  selector: 'app-locate-customer',
  templateUrl: './locate-customer.component.html'
})
export class LocateCustomerComponent implements OnInit {
    locationMessage: any;
 

  constructor(
    public dialogRef: MatDialogRef<LocateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions
  ) {
   
  }
  ngOnInit() {
    this.locationMessage = this.data.message;
    }
   
  
  
  
  
}
