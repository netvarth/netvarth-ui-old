import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomTemplatesComponent } from "./custom-templates.component";
import { TemplateViewComponent } from "./template-view/template-view.component";
const routes: Routes = [
    { path: '', component: CustomTemplatesComponent},
    { path: ':template', component: TemplateViewComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomTemplatesRoutingModule {}