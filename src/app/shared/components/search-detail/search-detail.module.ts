import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchDetailComponent } from './search-detail.component';
import { SearchDetailRoutingModule } from './search-detail.routing.module';
import { HeaderModule } from '../../modules/header/header.module';
import { MaterialModule } from '../../modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { RatingStarModule } from '../../modules/ratingstar/ratingstart.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { PagerModule } from '../../modules/pager/pager.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { ConsumerWaitlistHistoryComponent } from '../consumer-waitlist-history/consumer-waitlist-history.component';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ConsumerCheckinHistoryListModule } from '../../modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { SearchFormModule } from '../search-form/search-form.module';
import { ConsumerFooterModule } from '../../../ynw_consumer/components/footer/footer.module';
import { TruncateModule } from '../../pipes/limitTo.module';
import { CardModule } from '../card/card.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { QRCodeGeneratordetailComponent } from '../qrcodegenerator/qrcodegeneratordetail.component';
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
        ConsumerCheckinHistoryListModule,
        SearchDetailRoutingModule,
        RouterModule,
        LoadingSpinnerModule,
        SearchFormModule,
        ConsumerFooterModule,
        TruncateModule,
        CardModule,
        MatDialogModule,
        NgxQRCodeModule,
        ShareButtonsModule,
        ShareIconsModule
    ],
    declarations: [
        SearchDetailComponent,
        ConsumerWaitlistHistoryComponent,
        QRCodeGeneratordetailComponent
    ],
    entryComponents: [
        QRCodeGeneratordetailComponent
    ]
})

export class SearchDetailModule { }
