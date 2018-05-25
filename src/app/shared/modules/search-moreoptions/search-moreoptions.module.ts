import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { ClickOutsideModule } from 'ng4-click-outside';
import { RatingStarModule  } from '../../../shared/modules/ratingstar/ratingstart.module';

import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { SearchMoreOptionsComponent } from './search-moreoptions.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule,
      RatingStarModule,
      ClickOutsideModule
    ],
    declarations: [SearchMoreOptionsComponent],
    exports: [SearchMoreOptionsComponent],
    providers: [SearchDataStorageService]
})

export class SearchMoreoptionsModule {
}
