import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FooterNewComponent } from "./footer.component";

@NgModule({
    declarations: [FooterNewComponent],
    exports: [FooterNewComponent],
    imports: [
        CommonModule
    ]
})
export class BusinessFooterModule{}