import { NgModule } from "@angular/core";
import { OtherMiscellaneousComponent } from "./otherMiscellaneous.component";
import { SharedModule } from "../../../../shared/modules/common/shared.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
  { path: ':parent', component: OtherMiscellaneousComponent },
  { path: '/help', component: OtherMiscellaneousComponent }
];
@NgModule({
    imports: [
        SharedModule,
        HeaderModule,
        [RouterModule.forChild(routes)]
      ],
      declarations: [OtherMiscellaneousComponent],
      exports: [OtherMiscellaneousComponent],
      providers: []  
})
export class OtherMiscellaneousModule{

}