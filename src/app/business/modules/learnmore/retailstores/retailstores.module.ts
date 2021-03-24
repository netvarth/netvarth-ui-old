import { NgModule } from "@angular/core";
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { RetailStoresRoutingModule } from "./retailstores.routing.module";
import { RetailStoresComponent } from "./retailstores.component";
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
@NgModule({
    imports: [
        SharedModule,
        BreadCrumbModule,
        RetailStoresRoutingModule
      ],
      declarations: [RetailStoresComponent],
      exports: [RetailStoresComponent],
      providers: []
})
export class RetailStoresModule {

}