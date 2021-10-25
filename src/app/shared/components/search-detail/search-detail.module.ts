import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchDetailComponent } from './search-detail.component';
import { HeaderModule } from '../../modules/header/header.module';
import { FormsModule } from '@angular/forms';
import { RatingStarModule } from '../../modules/ratingstar/ratingstar.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { PagerModule } from '../../modules/pager/pager.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { SearchFormModule } from '../search-form/search-form.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInboxMessagesModule } from '../add-inbox-messages/add-inbox-messages.module';
import { JDNDetailModule } from '../jdn-detail/jdn-detail.module';
import { CouponsModule } from '../coupons/coupons.module';
import { ServiceDetailModule } from '../service-detail/service-detail.module';
import { LoginModule } from '../login/login.module';
import { QRCodeGeneratordetailModule } from '../qrcodegenerator/qrcodegeneratordetail.module';
import { SignupModule } from '../signup/signup.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: SearchDetailComponent },
    { path: ':id', loadChildren:() => import('../provider-detail/provider-detail.module').then(m=>m.ProviderDetailModule) },
    { path: ':id/history', loadChildren: () => import('../consumer-waitlist-history/consumer-waitlist-history.module').then(m=>m.ConsumerWaitlistHistoryModule) }
];
@NgModule({
    imports: [
        CommonModule,      
        FormsModule,
        RatingStarModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        FooterModule,
        [RouterModule.forChild(routes)],
        MatDialogModule,
        MatSelectModule,
        MatOptionModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        HeaderModule,
        SearchFormModule,
        CouponsModule,
        ServiceDetailModule,
        AddInboxMessagesModule,
        LoginModule,
        SignupModule,
        JDNDetailModule,
        QRCodeGeneratordetailModule
    ],
    declarations: [
        SearchDetailComponent
    ]
})

export class SearchDetailModule { }
