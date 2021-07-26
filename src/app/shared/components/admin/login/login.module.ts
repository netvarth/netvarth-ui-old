import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AdminLoginComponent} from './login.component';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from "./login.routing.module";

  @NgModule({

    declarations: [
        AdminLoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        LoginRoutingModule

    ],

})
export class LoginModule {}