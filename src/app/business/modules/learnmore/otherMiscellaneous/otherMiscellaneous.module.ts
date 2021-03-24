import { NgModule } from "@angular/core";
import { OtherMiscellaneousComponent } from "./otherMiscellaneous.component";
import { OtherMiscellaneousRoutingModule } from "./otherMiscellaneous.routing.module";
import { SharedModule } from "../../../../shared/modules/common/shared.module";
import { BreadCrumbModule } from "../../../../shared/modules/breadcrumb/breadcrumb.module";

@NgModule({
    imports: [
        SharedModule,
        BreadCrumbModule,
        OtherMiscellaneousRoutingModule
      ],
      declarations: [OtherMiscellaneousComponent],
      exports: [OtherMiscellaneousComponent],
      providers: []  
})
export class OtherMiscellaneousModule{

}