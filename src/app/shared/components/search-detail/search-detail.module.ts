import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchDetailComponent } from './search-detail.component';
import { SearchDetailRoutingModule } from './search-detail.routing.module';
import { HeaderModule } from '../../modules/header/header.module';
import { MaterialModule } from '../../modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { RatingStarModule } from '../../modules/ratingstar/ratingstar.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { PagerModule } from '../../modules/pager/pager.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { SearchFormModule } from '../search-form/search-form.module';
import { ConsumerFooterModule } from '../../../ynw_consumer/components/footer/footer.module';
import { TruncateModule } from '../../pipes/limitTo.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { QRCodeGeneratordetailComponent } from '../qrcodegenerator/qrcodegeneratordetail.component';
import { CheckinHistoryListModule } from '../../modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.module';
import { AddInboxMessagesModule } from '../add-inbox-messages/add-inbox-messages.module';
import { JDNDetailModule } from '../jdn-detail/jdn-detail.module';
import { CouponsModule } from '../coupons/coupons.module';
import { ServiceDetailModule } from '../service-detail/service-detail.module';
import { LoginModule } from '../login/login.module';
@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        MaterialModule,
        FormsModule,
        RatingStarModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        FooterModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        Nl2BrPipeModule,
        CheckinHistoryListModule,
        SearchDetailRoutingModule,
        RouterModule,
        LoadingSpinnerModule,
        SearchFormModule,
        ConsumerFooterModule,
        TruncateModule,
        MatDialogModule,
        NgxQRCodeModule,
        ShareButtonsModule,
        ShareIconsModule,
        AddInboxMessagesModule,
        JDNDetailModule,
        CouponsModule,
        ServiceDetailModule,
        LoginModule
    ],
    declarations: [
        SearchDetailComponent,
        QRCodeGeneratordetailComponent
    ],
    entryComponents: [
        QRCodeGeneratordetailComponent
    ]
})

export class SearchDetailModule { }
