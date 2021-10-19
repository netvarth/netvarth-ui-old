import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BprofileSearchAdwordsModule } from "../../provider-bprofile-search-adwords/bprofile-search-adwords.module";
import { KeywordsComponent } from "./keywords.component";
const routes: Routes = [
    {path:'', component: KeywordsComponent}
]
@NgModule({
    declarations: [KeywordsComponent],
    exports: [KeywordsComponent],
    imports: [
        CommonModule,
        RouterModule,
        BprofileSearchAdwordsModule,
        [RouterModule.forChild(routes)]
    ]
})
export class KeywordsModule{}