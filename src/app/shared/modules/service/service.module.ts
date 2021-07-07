import { NgModule } from '@angular/core';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { MaterialModule } from '../common/material.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { SharedModule } from '../common/shared.module';
import { AddServiceComponent } from '../../../business/modules/settings/general/users/settings/services/addservice/addservice.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UserlistpopupComponent } from './userlist/userlistpopup.component';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        CKEditorModule
    ],
    declarations: [ServiceComponent, AddServiceComponent,UserlistpopupComponent],
    entryComponents: [
        UserlistpopupComponent
    ],
    exports: [ServiceComponent]
})

export class ServiceModule { }
