import { NgModule, OnInit } from '@angular/core';
import { LicenseComponent } from './license.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { RouterModule, Routes } from '@angular/router';
import { UpgradeLicenseModule } from './upgrade-license/upgrade-license.module';
import { ProviderAuditLogModule } from '../provider-auditlogs/provider-auditlogs.module';
import { AddProviderAddonsModule } from '../add-provider-addons/add-provider-addons.module';
import { ConfirmBoxModule } from '../../../shared/components/confirm-box/confirm-box.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: LicenseComponent },
    { path: '', children: [
      { path: 'payment/history', loadChildren: ()=> import('../provider-payment-history/provider-payment-history.module').then(m=>m.ProviderPaymentHistoryModule)},
      { path: 'addons', loadChildren: ()=> import('./addons/addons.module').then(m=>m.AddonsModule)},
      { path: 'keywords',loadChildren: ()=> import('./keywords/keywords.module').then(m=>m.KeywordsModule)},
      { path: 'Statements', loadChildren: ()=> import('./statements/statements.module').then(m=>m.StatementsModule)},
      { path: 'invoicestatus', loadChildren: ()=> import('./invoicestatus/invoicestatus.module').then(m=>m.InvoiceStatusModule)},
      { path: 'licenseusage', loadChildren: ()=> import('./licenseusage/licenseusage.module').then(m=>m.LicenseusageModule)},
      { path: 'viewstatement',loadChildren: ()=> import('./statements/viewprevstatement/viewprevstatement.module').then(m=>m.ViewPrevStatementModule)},
      { path: 'payments', loadChildren: ()=> import('./payments/licensepayment.module').then(m=>m.LicensePaymentModule)},
      { path: 'addon-detail', loadChildren: ()=> import('./addons/addon-detail/addon-detail.module').then(m=>m.AddonDetailModule)}
    ]},
    { path: ':type', component: LicenseComponent },
  ];
@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        LoadingSpinnerModule,
        PagerModule,
        CapitalizeFirstPipeModule,
        AddProviderAddonsModule,
        ProviderAuditLogModule,
        [RouterModule.forChild(routes)],

        UpgradeLicenseModule,
        ProviderAuditLogModule,
        ConfirmBoxModule
    ],
    declarations: [
        LicenseComponent
    ],
    exports: [LicenseComponent]
})

export class LicenseModule implements OnInit {
    ngOnInit() {

    }
}
