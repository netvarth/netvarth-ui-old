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
import { ProviderDetailComponent } from '../provider-detail/provider-detail.component';
import { ConsumerWaitlistHistoryComponent } from '../consumer-waitlist-history/consumer-waitlist-history.component';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ConsumerCheckinHistoryListModule } from '../../modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { SearchProviderModule } from '../search-provider/search-provider.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
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
        ModalGalleryModule.forRoot(),
        Nl2BrPipeModule,
        ConsumerCheckinHistoryListModule,
        SearchDetailRoutingModule,
        SearchProviderModule,
        RouterModule,
        LoadingSpinnerModule
    ],
    declarations: [
        SearchDetailComponent,
        ProviderDetailComponent,
        ConsumerWaitlistHistoryComponent
    ],
    entryComponents: [
       
    ]
})

export class SearchDetailModule { }
