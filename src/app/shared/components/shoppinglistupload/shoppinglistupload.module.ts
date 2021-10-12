import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { ShoppinglistuploadComponent } from "./shoppinglistupload.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    exports: [ShoppinglistuploadComponent],
    declarations: [
        ShoppinglistuploadComponent 
    ]
})
export class ShoppingListUploadModule {}