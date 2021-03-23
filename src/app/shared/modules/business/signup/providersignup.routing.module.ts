import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvidersignupComponent } from './providersignup.component';

const routes: Routes = [
    { path: '', component: ProvidersignupComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class providersignupRoutingModule {}
