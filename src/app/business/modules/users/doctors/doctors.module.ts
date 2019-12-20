import { NgModule } from '@angular/core';
import { DoctorsRoutingModule } from './doctors.routing.module';
import { DoctorsComponent } from './doctors.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BranchDoctorDetailComponent } from './details/doctors-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    declarations: [
        DoctorsComponent,
        BranchDoctorDetailComponent
    ],
    imports: [
        DoctorsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CommonModule,
        FormMessageDisplayModule,
        FormsModule,
        LoadingSpinnerModule,
        ReactiveFormsModule
    ],
    entryComponents: [],
    exports: [DoctorsComponent]
})
export class DoctorsModule {} 
