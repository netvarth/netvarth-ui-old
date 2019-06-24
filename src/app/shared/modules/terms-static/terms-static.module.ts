import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { TermsStaticComponent } from './terms-static.component';
import { TermsRoutingModule } from './terms-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
      TermsRoutingModule,
      RouterModule,
      CommonModule
    ],
    declarations: [TermsStaticComponent]
})

export class TermsStaticModule {}
