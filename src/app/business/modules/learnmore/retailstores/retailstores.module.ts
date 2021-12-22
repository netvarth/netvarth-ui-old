import { NgModule } from "@angular/core";
import { RetailStoresRoutingModule } from "./retailstores.routing.module";
import { RetailStoresComponent } from "./retailstores.component";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
@NgModule({
    imports: [
      CommonModule,
      MatExpansionModule,
      RetailStoresRoutingModule
      ],
      declarations: [RetailStoresComponent],
      exports: [RetailStoresComponent],
      providers: []
})
export class RetailStoresModule {

}