import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JaldeeCashRoutingModule } from './jaldee-cash-routing.module';
import { TermsconditionComponent } from './termscondition/termsconditionpopup.component';


@NgModule({
  declarations: [TermsconditionComponent],
  imports: [
    CommonModule,
    JaldeeCashRoutingModule
  ],
  entryComponents: [
    TermsconditionComponent
  ],
})
export class JaldeeCashModule { }
