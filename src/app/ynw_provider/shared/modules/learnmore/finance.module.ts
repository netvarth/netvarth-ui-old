import { NgModule } from '@angular/core';
import { HealthcareLearnmoreComponent } from '../../../components/help/healthcare_learnmore/healthcare_learnmore.component';
import { LearnmoreRoutingModule } from './learnmore_routing.module';
import { FinanceLearnmoreComponent } from '../../../components/help/finance_learnmore/finance_learnmore.component';


// import { SearchDataStorageService  } from '../../services/search-datastorage.services';


// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
        LearnmoreRoutingModule
    ],
    declarations: [FinanceLearnmoreComponent],
    exports: [FinanceLearnmoreComponent],
    providers: []
})

export class FinanceModule {
}
