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
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ServiceQRCodeGeneratordetailComponent } from './serviceqrcodegenerator/serviceqrcodegeneratordetail.component';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        LoadingSpinnerModule,
        CKEditorModule,
        NgxQRCodeModule,
        ShareButtonsModule,
        ShareIconsModule,
    ],
    declarations: [ServiceComponent,
         AddServiceComponent,
         UserlistpopupComponent,
        ServiceQRCodeGeneratordetailComponent],
    entryComponents: [
        UserlistpopupComponent,
        ServiceQRCodeGeneratordetailComponent
    ],
    exports: [ServiceComponent]
})

export class ServiceModule { }
