import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { PersonalCareLearnmoreComponent } from '../../../../ynw_provider/components/personalcare_learnmore/personalcare_learnmore.component';


// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [PersonalCareLearnmoreComponent],
    exports: [PersonalCareLearnmoreComponent],
    providers: []
})

export class PersonalcareModule {
}