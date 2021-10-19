import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { ServicePageHealthcareComponent } from "./service-page-healthcare.component";
const routes: Routes = [
    {path: '', component: ServicePageHealthcareComponent }
]
@NgModule({
    declarations: [ServicePageHealthcareComponent],
    exports: [ServicePageHealthcareComponent],
    imports: [
        ScrollToModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ServicePageHealthcareModule{}