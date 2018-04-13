import { NgModule } from '@angular/core';

import {NgbModule , NgbTimepickerModule, NgbTimepickerConfig, NgbDropdownModule, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
      NgbModule,
      NgbTimepickerModule,
      NgbDropdownModule
    ],
    exports: [
      NgbModule,
      NgbTimepickerModule,
      NgbDropdownModule
    ],
    providers: [
      NgbTimepickerConfig,
      NgbDropdownConfig
    ]
})

export class NgBootstrapModule {

}
