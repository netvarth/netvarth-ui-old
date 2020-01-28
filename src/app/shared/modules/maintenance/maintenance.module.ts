import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
// import { HeaderModule } from '../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { MaintenanceComponent } from './maintenance.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule
      
    ],
    declarations: [MaintenanceComponent],
    exports: [MaintenanceComponent],
    providers: []
})

export class MaintenanceModule {}
