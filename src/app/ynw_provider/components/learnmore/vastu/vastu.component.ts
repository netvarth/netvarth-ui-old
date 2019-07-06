import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-vastu-learnmore',
    templateUrl: './vastu.component.html'
})

export class VastuComponent implements OnChanges {
    @Input() parent;
    @Input() child;
    parentContent;
    childContent;

    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
}
