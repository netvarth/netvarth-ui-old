import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { IntegrationSettingsComponent } from './integration-settings.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {path: '', component: IntegrationSettingsComponent}
];
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        IntegrationSettingsComponent,
    ],
    exports: [
        IntegrationSettingsComponent
    ]
})
export class IntegrationSettingsModule {}
