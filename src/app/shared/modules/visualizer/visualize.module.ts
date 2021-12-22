import { VisualizeComponent } from './visualize.component';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatDialogModule
    ],
    entryComponents: [VisualizeComponent],
    declarations: [VisualizeComponent],
    exports: [VisualizeComponent]
})

export class VisualizeModule { }
