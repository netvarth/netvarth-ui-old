import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-religious-learnmore',
    templateUrl: './religious.component.html'
})

export class ReligiousComponent implements OnChanges {
    @Input() parent;
    @Input() child;
    parentContent;
    childContent;

    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
}
