import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AboutComponent } from './about.component';
const routes: Routes = [
    { path: '', component: AboutComponent }
];
@NgModule({
    imports: [
        ScrollToModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        AboutComponent
    ],
    exports: [AboutComponent]
})
export class AboutModule { }
