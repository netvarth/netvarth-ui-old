import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { VastuLearnmoreComponent } from '../../../components/help/vastu_learnmore/vastu_learnmore.component';



// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [VastuLearnmoreComponent],
    exports: [VastuLearnmoreComponent],
    providers: []
})

export class VastuModule {
}
