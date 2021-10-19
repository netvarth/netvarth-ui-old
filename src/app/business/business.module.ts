import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BusinessRoutingModule } from './business-routing.module';
import { AuthGuardProviderHome, AuthGuardNewProviderHome } from '../shared/guard/auth.guard';
import { ProviderServices } from './services/provider-services.service';
import { ProviderDataStorageService } from './services/provider-datastorage.service';
import { MessageService } from './services/provider-message.service';
import { ProviderSharedFuctions } from './functions/provider-shared-functions';
import { ProviderResolver } from './services/provider-resolver.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { projectConstants } from '../app.component';
import { BusinessComponent } from './business.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../shared/modules/loading-spinner/loading-spinner.module';
import { JoyrideModule } from 'ngx-joyride';
import { UpdateEmailModule } from './modules/update-email/update-email.module';
import { MenuModule } from './home/menu/menu.module';
import { BusinessHeaderModule } from './home/header/header.module';

@NgModule({
    declarations: [
        BusinessComponent
    ],
    imports: [
        BusinessRoutingModule,
        RouterModule,
        CommonModule,
        LoadingSpinnerModule,
        MenuModule,
        BusinessHeaderModule,
        JoyrideModule.forRoot(),
        UpdateEmailModule,
    ],
    providers: [
        AuthGuardProviderHome,
        AuthGuardNewProviderHome,
        ProviderServices,
        ProviderDataStorageService,
        MessageService,
        ProviderSharedFuctions,
        ProviderResolver,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
    ]
})

export class BusinessModule {

}
