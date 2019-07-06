import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-veterinary-learnmore',
    templateUrl: './veterinary.component.html'
})

export class VeterinaryComponent implements OnChanges {
    @Input() parent;
    @Input() child;
    parentContent;
    childContent;

    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
}
