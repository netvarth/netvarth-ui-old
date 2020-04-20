import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-donationmanager',
    templateUrl: './donation.component.html'
})
export class donationcomponent {

  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Donation Manager ',
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  constructor(private router: Router,  
    private routerobj: Router)
    {
    // this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

 
  gotocauses() {
     this.router.navigate(['provider', 'settings', 'donationmanager']);

  }
//   learnmore_clicked(mod, e) {
//     e.stopPropagation();
//     this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
//   }
// }


  
}
