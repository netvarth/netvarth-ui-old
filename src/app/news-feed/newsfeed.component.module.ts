import { CommonModule } from "@angular/common";
import {NgModule } from "@angular/core";
import { NewsfeedComponent } from "./newsfeed.component";
import { NewsfeedRoutingModule } from "./newsfeed.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AddnewsfeeddialogComponent } from "./addnewsfeed/addnewsfeeddialog.component";
import {MatMenuModule} from '@angular/material/menu';
@NgModule({
    declarations: [
        NewsfeedComponent,
        AddnewsfeeddialogComponent
    ],
    imports: [
        CommonModule,
        NewsfeedRoutingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatMenuModule

    ],
    entryComponents: [
        
    ],
    schemas:[
    ],
    exports: [
        NewsfeedComponent
    ]
})
export class NewsfeedModule {}