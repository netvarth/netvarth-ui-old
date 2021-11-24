import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { OwlModule } from "ngx-owl-carousel";
import { CustomTemplatesComponent } from "./custom-templates.component";
import { CustomTemplatesRoutingModule } from "./custom-templates.routing.module";
import { TemplateViewComponent } from "./template-view/template-view.component";
import { Template1Component } from "./template1/template1.component";
import { Template2Component } from "./template2/template2.component";
import {MatInputModule} from '@angular/material/input';
import { Template3Component } from "./template3/template3.component";
import {MatFormFieldModule} from '@angular/material/form-field';
import { CustomTemplatesService } from "./custom-templates.service";
import { SafeHtmlModule } from "../shared/pipes/safe-html/safehtml.module";
import { TranslateModule } from "@ngx-translate/core";
import { CardModule } from "../shared/components/card/card.module";
@NgModule({
    declarations: [
        Template1Component,
        Template2Component,
        Template3Component,
        CustomTemplatesComponent,
        TemplateViewComponent,
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        CustomTemplatesRoutingModule,
        CKEditorModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        OwlModule,
        SafeHtmlModule,
        TranslateModule,
        CardModule
    ],
    providers: [
        CustomTemplatesService
    ],
    entryComponents: [
        
    ],
    schemas:[
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        CustomTemplatesComponent
    ]
})
export class CustomTemplatesModule {}