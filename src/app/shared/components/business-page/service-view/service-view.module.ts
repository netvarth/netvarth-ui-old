import { NgModule } from '@angular/core';
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
import { ConsumerJoinModule } from '../../../../ynw_consumer/components/consumer-join/join.component.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Routes, RouterModule } from '@angular/router';
import { SignupModule } from '../../signup/signup.module';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { VirtualFieldsModule } from '../../../../ynw_consumer/components/virtualfields/virtualfields.module';
const routes: Routes = [
    { path: '', component: ServiceViewComponent }
];
@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        CarouselModule,
        FormsModule,
        RatingStarModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        Nl2BrPipeModule,
        LoadingSpinnerModule,
        SearchFormModule,
        TruncateModule,
        CardModule,
        MatDialogModule,
        ConsumerJoinModule,
        MatTooltipModule,
        VirtualFieldsModule,
        SignupModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ServiceViewComponent
    ],
    exports: [
        ServiceViewComponent
    ]
})
export class ServiceViewModule { }
