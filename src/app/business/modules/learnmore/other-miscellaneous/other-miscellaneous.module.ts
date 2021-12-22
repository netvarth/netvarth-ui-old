import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterModule, Routes } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { OtherMiscellaneousComponent } from "./other-miscellaneous.component";
const routes: Routes = [
  { path: ':parent', component: OtherMiscellaneousComponent },
  { path: '/help', component: OtherMiscellaneousComponent }
];
@NgModule({
    imports: [
      ScrollToModule.forRoot(),
      MatExpansionModule,
      CommonModule,
      [RouterModule.forChild(routes)]
      ],
      declarations: [OtherMiscellaneousComponent],
      exports: [OtherMiscellaneousComponent],
      providers: []  
})
export class OtherMiscellaneousModule{

}