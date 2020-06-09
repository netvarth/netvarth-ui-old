import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OtherMiscellaneousComponent } from "./otherMiscellaneous.component";

const routes: Routes = [
    { path: ':parent', component: OtherMiscellaneousComponent },
    { path: '/help', component: OtherMiscellaneousComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherMiscellaneousRoutingModule{

}