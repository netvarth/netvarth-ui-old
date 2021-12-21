import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustTemplate1Module } from "../templates/cust-template1/cust-template1.module";
import { CustTemplates2Module } from "../templates/cust-template2/cust-templates2.module";
import { CustomAppComponent } from "./custom-app.component";
const routes: Routes = [
    { path: '', component: CustomAppComponent}
];
@NgModule({
    declarations: [
        CustomAppComponent
    ],
    imports: [
        CommonModule,
        CustTemplate1Module,
        CustTemplates2Module,
        [RouterModule.forChild(routes)]
    ],
    exports: [CustomAppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class CustomAppModule{}
