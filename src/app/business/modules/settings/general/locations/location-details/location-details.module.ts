import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { LocationDetailsComponent } from './location-details.component';
import { GooglemapModule } from '../../../../../../business/modules/googlemap/googlemap.module';
import { AddProviderWaitlistLocationsModule } from '../../../../../../business/modules/add-provider-waitlist-locations/add-provider-waitlist-locations.module';
const routes: Routes = [
    {path: '', component: LocationDetailsComponent}
]
@NgModule({
    imports: [
        GooglemapModule,
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        AddProviderWaitlistLocationsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        LocationDetailsComponent
    ],
    exports: [LocationDetailsComponent]
})
export class LocationDetailsModule { }
