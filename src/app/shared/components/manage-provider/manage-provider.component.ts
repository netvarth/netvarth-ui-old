import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Title } from '@angular/platform-browser';
import { SessionStorageService } from '../../services/session-storage.service';
import { GroupStorageService } from '../../services/group-storage.service';

@Component({
    'selector': 'app-manage-provider',
    templateUrl: './manage-provider.component.html'
})
export class ManageProviderComponent implements OnInit {
    accountId;
    constructor(private router: Router,
        private provider_service: ProviderServices,
        private activated_route: ActivatedRoute,
        private sessionStorageService: SessionStorageService,
        private groupService: GroupStorageService,
        private titleService: Title) {
            this.activated_route.params.subscribe(params => {
                this.accountId = params.id;
              });
    }
    ngOnInit() {
        this.provider_service.manageProvider(this.accountId).subscribe(
            (data: any) => {
                this.sessionStorageService.setitemOnSessionStorage('tabId', data.tabId);
                this.sessionStorageService.setitemOnSessionStorage('accountid', this.accountId);
                data['accountType'] = 'BRANCH_SP';
                this.titleService.setTitle(data.userName);
                this.groupService.setitemToGroupStorage('ynw-user', data);
                this.router.navigate(['/provider/check-ins']);

        }, error => {
        });
    }
}
