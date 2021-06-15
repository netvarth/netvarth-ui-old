import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JaldeeCashRoutingModule } from './jaldee-cash-routing.module';
import { TermsconditionComponent } from './termscondition/termsconditionpopup.component';
import { SpentlistwithidComponent } from './spentlistwithId/spentlistwithidpopup.component';

@NgModule({
  declarations: [TermsconditionComponent,
    SpentlistwithidComponent],
  imports: [
    CommonModule,
    JaldeeCashRoutingModule
  ],
  entryComponents: [
    TermsconditionComponent,
    SpentlistwithidComponent
  ],
})
export class JaldeeCashModule { }
