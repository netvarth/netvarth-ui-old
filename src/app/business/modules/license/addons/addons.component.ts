import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderAddonAuditlogsComponent } from '../../../../ynw_provider/components/provider-addon-auditlogs/provider-addon-auditlogs.component';
import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { Router } from '@angular/router';

@Component({
    selector: 'app-addons',
    templateUrl: './addons.component.html'
})

export class AddonsComponent implements OnInit, OnDestroy {
    addon_cap = Messages.ADD_ON_CAP;
    no_addon_cap = Messages.NO_ADDON_CAP;
    frm_addon_cap = Messages.FRM_LEVEL_PROVIDER_LIC_ADDON_MSG;
    addondialogRef;
    addonhistorydialogRef;
    license_message = '';
    currentlicense_details: any = [];
    tooltipcls = projectConstants.TOOLTIP_CLS;
    current_lic;
    addonTooltip = '';
    domain;
    learn_more = Messages.LEARN_MORE_CAP;
    history_cap = Messages.HISTORY_HOME_CAP;
    breadcrumbs = [
        {
            title: 'License & Invoice',
            url: '/provider/license'
        },
        {
            title: 'Add-ons'
        }
    ];
    constructor(
        private dialog: MatDialog,
        private provider_servicesobj: ProviderServices,
        private shared_functions: SharedFunctions,
        private routerobj: Router,
        private sharedfunctionObj: SharedFunctions
    ) { }

    ngOnInit() {
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
        this.addonTooltip = this.sharedfunctionObj.getProjectMesssages('ADDON_TOOLTIP');
        this.getLicenseDetails();
    }
    getLicenseDetails(call_type = 'init') {
        this.provider_servicesobj.getLicenseDetails()
            .subscribe(data => {
                this.currentlicense_details = data;
                this.current_lic = this.currentlicense_details.accountLicense.displayName;
                const ynw_user = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
                ynw_user.accountLicenseDetails = this.currentlicense_details;
                this.sharedfunctionObj.setitemonLocalStorage('ynw-user', ynw_user);
            });
    }
    ngOnDestroy() {
        if (this.addondialogRef) {
            this.addondialogRef.close();
        }
        if (this.addonhistorydialogRef) {
            this.addonhistorydialogRef.close();
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/license->' + mod]);
        // this.routerobj.navigate(['/provider/learnmore/license->' + mod]);
        // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
        // this.sharedfunctionObj.sendMessage(pdata);
    }
    goAddonHistory() {
        this.addonhistorydialogRef = this.dialog.open(ProviderAddonAuditlogsComponent, {
            width: '50%',
            data: {
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.addonhistorydialogRef.afterClosed().subscribe(() => {
        });
    }
    showadd_addons() {
        this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
            width: '50%',
            data: {
                type: 'addons'
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.addondialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
               this.getLicenseDetails();
            }
        });
    }
}
