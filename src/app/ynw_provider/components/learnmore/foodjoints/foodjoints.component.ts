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
    activePrice = '';
    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
    setActivePricing(item) {
        this.activePrice = item;
      }
}
