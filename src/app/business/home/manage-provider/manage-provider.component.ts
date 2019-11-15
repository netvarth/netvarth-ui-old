import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
    'selector': 'app-manage-provider',
    templateUrl: './manage-provider.component.html'
})
export class ManageProviderComponent implements OnInit {
    accountId;
    constructor(private router: Router,
        private provider_service: ProviderServices,
        private activated_route: ActivatedRoute,
        private sharedFunctions: SharedFunctions) {
            this.activated_route.params.subscribe(params => {
                this.accountId = params.id;
              });
    }
    ngOnInit() {
        this.provider_service.manageProvider(this.accountId).subscribe(
            (data: any) => {
                console.log(data);
                this.sharedFunctions.setitemOnSessionStorage('tabId', data.tabId);
                this.sharedFunctions.setitemOnSessionStorage('accoutid', this.accountId);
                this.sharedFunctions.setitemToGroupStorage('ynw-user', data);
                this.router.navigate(['/provider/check-ins']);

        }, error => {
            console.log(error);
        });
    }
}
