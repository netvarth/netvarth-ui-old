import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineUsersComponent } from './online-users.component';
import { CardModule } from '../../shared/components/card/card.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    OnlineUsersComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    RouterModule
  ],
  exports:[
    OnlineUsersComponent
  ]
})
export class OnlineUsersModule { }
