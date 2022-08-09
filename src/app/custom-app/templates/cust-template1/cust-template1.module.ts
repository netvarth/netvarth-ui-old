import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { SafeHtmlModule } from '../../../shared/pipes/safe-html/safehtml.module';
import { RouterModule, Routes } from '@angular/router';
import { ConsDepartmentsModule } from '../../cons-departments/cons-departments.module';
import { PictureGalleryModule } from '../../picture-gallery/picture-gallery.module';
import { OnlineUsersModule } from '../../online-users/online-users.module';
import { OrdersModule } from '../../orders/orders.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { ServiceDisplayModule } from '../../service-display/service-display.module';
import { AppointmentServicesModule } from '../../appointment-services/appointment-services.module';
import { DonationServicesModule } from '../../donation-services/donation-services.module';
import { CheckinServicesModule } from '../../checkin-services/checkin-services.module';
import { ConsumerJoinModule } from '../../../ynw_consumer/components/consumer-join/join.component.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInboxMessagesModule } from '../../../shared/components/add-inbox-messages/add-inbox-messages.module';
import { MatButtonModule } from '@angular/material/button';
import { CustTemplate1Component } from './cust-template1.component';
import { BasicProfileModule } from '../../basic-profile/basic-profile.module';
const routes: Routes = [
    { path: '', component: CustTemplate1Component }
];

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        SafeHtmlModule,
        CardModule,
        OrdersModule,
        ServiceDisplayModule,
        ConsDepartmentsModule,
        PictureGalleryModule,
        OnlineUsersModule,
        AppointmentServicesModule,
        DonationServicesModule,
        CheckinServicesModule,
        ConsumerJoinModule,
        MatDialogModule,
        MatButtonModule,
        AddInboxMessagesModule,
        BasicProfileModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ],
    declarations: [CustTemplate1Component],
    exports: [CustTemplate1Component]
})
export class CustTemplate1Module {}