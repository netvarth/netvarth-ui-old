import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../../modules/header/header.module';
import { FormsModule } from '@angular/forms';
import { RatingStarModule } from '../../../modules/ratingstar/ratingstar.module';
import { CapitalizeFirstPipeModule } from '../../../pipes/capitalize.module';
import { PagerModule } from '../../../modules/pager/pager.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { LoadingSpinnerModule } from '../../../modules/loading-spinner/loading-spinner.module';
import { SearchFormModule } from '../../search-form/search-form.module';
import { TruncateModule } from '../../../pipes/limitTo.module';
import { CardModule } from '../../card/card.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceViewComponent } from './service-view.component';
import { ServiceViewRoutingModule } from './service-view.routing.module';
import { CheckinHistoryListModule } from '../../../../shared/modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.module';
import { ConsumerJoinModule } from '../../../../ynw_consumer/components/consumer-join/join.component.module';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        FormsModule,
        RatingStarModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        Nl2BrPipeModule,
        CheckinHistoryListModule,
        RouterModule,
        LoadingSpinnerModule,
        SearchFormModule,
        TruncateModule,
        CardModule,
        MatDialogModule,
        ServiceViewRoutingModule,
        ConsumerJoinModule,
        MatTooltipModule
    ],
    declarations: [
        ServiceViewComponent
    ],
    exports: [
        ServiceViewComponent
    ]
})

export class ServiceViewModule { }
