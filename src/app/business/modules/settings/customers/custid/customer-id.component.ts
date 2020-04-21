import { Component } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
@Component({
    'selector': 'app-custid',
    'templateUrl': './customer-id.component.html'
})
export class CustomerIdSettingsComponent {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Customers',
            url: '/provider/settings/customers'
        },
        {
            title: 'Customer Id'
        }
    ];
    prefixName;
    suffixName;
    formChange = 0;
    showfixes = false;
    // customerSeries: any;

    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        ) {
        };

  ngOnInit() {
    } 
  OnSubmit() {
    const post_data = {
        'prefix': this.prefixName,
        'suffix': this.suffixName
      };
        
      // this.provider_services.updatecustomerseries(this.customerSeries, post_data)
      // .subscribe(data => {     
      //   this.shared_Functionsobj.openSnackBar('Successfull', { 'panelclass': 'snackbarerror' });
      // }); 
    this.formChange = 0;
    this.showfixes = false;
  }

onFormChange(Radiochange) {
  console.log(Radiochange);
  if(Radiochange.value === 'Pattern')
    {
      this.showfixes = true;
    }
    else{
      this.showfixes = false;
    }
    this.formChange = 1;
  }
  cancel() {
    this.formChange = 0;
    this.showfixes = false;
  }
}
