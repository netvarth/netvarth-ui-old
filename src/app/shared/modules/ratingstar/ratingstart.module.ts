import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { RatingStarComponent } from './ratingstar.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule
    ],
    declarations: [RatingStarComponent],
    exports: [RatingStarComponent],
    providers: []
})

export class RatingStarModule {
}
