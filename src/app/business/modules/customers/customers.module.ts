import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { CustomersRoutingModule } from './customers.routing.module';
import { CustomersListComponent } from './list/customers-list.component';
import { JaldeeFilterModule } from '../../../shared/modules/filter/filter.module';
import { DateFormatPipeModule } from '../../../shared/pipes/date-format/date-format.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerSearchComponent } from './search/customer-search.component';
import { OwlModule } from 'ngx-owl-carousel';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MedicalrecordModule } from '../medicalrecord/medicalrecord.module';
import { CustomerActionsComponent } from './customer-actions/customer-actions.component';
import { InboxModule } from '../../../shared/modules/inbox/inbox.module';
import { CustomerDetailComponent } from './customer-details/customer-details.component';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        BreadCrumbModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        LoadingSpinnerModule,
        CustomersRoutingModule,
        JaldeeFilterModule,
        DateFormatPipeModule,
        FormMessageDisplayModule,
        CheckinAddMemberModule,
        NgxMatSelectSearchModule,
        NgbModule,
        OwlModule,
        InboxModule,
        QuestionnaireModule
    ],
    declarations: [
        CustomersListComponent,
        CustomerDetailComponent,
        CustomerCreateComponent,
        CustomerSearchComponent,
        CustomerActionsComponent
    ],
    entryComponents: [
        CustomerActionsComponent
    ],
    exports: [CustomersListComponent, MedicalrecordModule]
})

export class CustomersModule { }
