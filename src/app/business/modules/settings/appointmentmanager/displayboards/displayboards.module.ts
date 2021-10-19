import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardsComponent } from './displayboards.component';
import { ShowMessagesModule } from '../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
const routes: Routes = [
    { path: '', component: DisplayboardsComponent},
    // { path: 'q-set', loadChildren: () => import('./q-set/displayboard-qset.module').then(m => m.DisplayboardQSetModule)},
    // { path: 'global', loadChildren: () => import('./global-settings/global-settings.module').then(m => m.GlobalSettingsModule)},
    { path: ':id', loadChildren: () => import('./detail/displayboard-details.module').then(m=>m.DisplayboardDetailModule)}
];
@NgModule({
    declarations: [
        DisplayboardsComponent
    ],
    imports: [
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        ShowMessagesModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatOptionModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        DisplayboardsComponent
    ]
})
export class DisplayboardsModule { }

