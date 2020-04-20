import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    'selector': 'app-comm-settings',
    'templateUrl': './comm-settings.component.html'
})
export class CommSettingsComponent implements OnInit {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Comm'
        }
    ];
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {
    }
    ngOnInit() {

    }

    gotoVideoSettings() {
        this.router.navigate(['provider', 'settings', 'comm', 'video']);
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        // this.router.navigate(['/provider/' + this.domain + '/payments->' + mod]);
      }
}
