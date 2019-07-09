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
    activePrice = '';

    ngOnChanges() {
        this.parentContent = this.parent;
        this.childContent = this.child;
    }
    setActivePricing(item) {
        this.activePrice = item;
      }
}
