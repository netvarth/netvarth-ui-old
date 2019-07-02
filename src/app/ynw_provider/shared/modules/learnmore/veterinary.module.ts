import { NgModule } from '@angular/core';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { VeterinaryLearnmoreComponent } from '../../../../ynw_provider/components/veterinary_learnmore/veterinary_learnmore.component';



// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [VeterinaryLearnmoreComponent],
    exports: [VeterinaryLearnmoreComponent],
    providers: []
})

export class VeterinaryModule {
}