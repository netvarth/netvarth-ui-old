import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { ProfessionalLearnmoreComponent } from '../../../../ynw_provider/components/professional_learnmore/professional_learnmore.component';


// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [ProfessionalLearnmoreComponent],
    exports: [ProfessionalLearnmoreComponent],
    providers: []
})

export class ProfessionalModule {
}