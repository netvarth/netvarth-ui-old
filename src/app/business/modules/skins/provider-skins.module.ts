import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { ProviderSkinsComponent } from './provider-skins.component';
import { ProviderSkinsRoutingModule } from './provider-skins-routing.module';

@NgModule({
    imports: [
        ProviderSkinsRoutingModule,
        CommonModule,
        BreadCrumbModule
    ],
    declarations: [
        ProviderSkinsComponent
    ],
    exports: [ProviderSkinsComponent]
})
export class ProviderSkinsModule {}

