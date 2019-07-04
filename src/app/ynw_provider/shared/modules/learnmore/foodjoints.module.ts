import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { FoodjointsLearnmoreComponent } from '../../../components/help/food_learnmore/food_learnmore.component';


// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [FoodjointsLearnmoreComponent],
    exports: [FoodjointsLearnmoreComponent],
    providers: []
})

export class FoodjointsModule {
}
