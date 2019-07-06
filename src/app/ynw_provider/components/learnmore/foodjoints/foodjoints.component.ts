import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-foodjoints-learnmore',
    templateUrl : './foodjoints.component.html'
})

export class FoodJointComponent implements OnChanges {
    @Input() parent;
    @Input() child;
    parentContent;
    childContent;

    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
}
