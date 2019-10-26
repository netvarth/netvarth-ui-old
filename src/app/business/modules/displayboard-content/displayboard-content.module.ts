import { NgModule } from '@angular/core';
import { DisplayboardLayoutContentComponent } from './displayboard-content.component';
import { CommonModule } from '@angular/common';
import { DisplayboardContentRoutingModule } from './displayboard-content-routing.module';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AuthGuardProvider } from '../../../shared/guard/auth.guard';
@NgModule({
    declarations: [
        DisplayboardLayoutContentComponent
    ],
    imports: [
        CommonModule,
        DisplayboardContentRoutingModule
    ],
    exports: [],
    providers: [
        AuthGuardProvider,
        SharedFunctions,
        ProviderServices
    ]
})
export class DisplayboardLayoutContentModule {
}

