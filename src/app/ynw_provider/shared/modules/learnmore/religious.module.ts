import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { ReligiousLearnmoreComponent } from '../../../../ynw_provider/components/religious_learnmore/religious_learnmore.component';



// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [ReligiousLearnmoreComponent],
    exports: [ReligiousLearnmoreComponent],
    providers: []
})

export class ReligiousModule {
}