import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../../modules/header/header.module';
import { MaterialModule } from '../../../modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { RatingStarModule } from '../../../modules/ratingstar/ratingstart.module';
import { CapitalizeFirstPipeModule } from '../../../pipes/capitalize.module';
import { PagerModule } from '../../../modules/pager/pager.module';
import { FooterModule } from '../../../modules/footer/footer.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ConsumerCheckinHistoryListModule } from '../../../modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { LoadingSpinnerModule } from '../../../modules/loading-spinner/loading-spinner.module';
import { SearchFormModule } from '../../search-form/search-form.module';
import { ConsumerFooterModule } from '../../../../ynw_consumer/components/footer/footer.module';
import { TruncateModule } from '../../../pipes/limitTo.module';
import { CardModule } from '../../card/card.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceViewComponent } from './service-view.component';
import { ServiceViewRoutingModule } from './service-view.routing.module';
import { OwlModule } from 'ngx-owl-carousel';
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
        RouterModule,
        LoadingSpinnerModule,
        SearchFormModule,
        ConsumerFooterModule,
        TruncateModule,
        CardModule,
        MatDialogModule,
        ServiceViewRoutingModule,
        OwlModule
    ],
    declarations: [
        ServiceViewComponent
    ],
    exports: [
        ServiceViewComponent
    ]
})

export class ServiceViewModule { }
