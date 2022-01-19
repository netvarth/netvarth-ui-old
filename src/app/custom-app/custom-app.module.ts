import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../shared/modules/header/header.module";
import { ConsumerJoinModule } from "../ynw_consumer/components/consumer-join/join.component.module";
import { CustomAppComponent } from "./custom-app.component";
import { CustomappService } from "./customapp.service";
const routes: Routes = [
    { path: '', component: CustomAppComponent,
    children: [
        { path: 'template1', loadChildren:() => import('./templates/cust-template1/cust-template1.module').then(m => m.CustTemplate1Module), outlet: 'template'},
        { path: 'template2', loadChildren:() => import('./templates/cust-template2/cust-template2.module').then(m => m.CustTemplate2Module), outlet: 'template'},
        { path: 'template3', loadChildren:() => import('./templates/cust-template3/cust-template3.module').then(m => m.CustTemplate3Module), outlet: 'template'},
        { path: 'template4', loadChildren:() => import('./templates/cust-template4/cust-template4.module').then(m => m.CustTemplate4Module), outlet: 'template'}
    ]}
];
@NgModule({
    declarations: [
        CustomAppComponent
    ],
    imports: [
        CommonModule,
        ConsumerJoinModule,
        HeaderModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [CustomAppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        CustomappService
    ]
})
export class CustomAppModule{}
