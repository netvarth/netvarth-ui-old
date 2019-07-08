import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-healthcare-learnmore',
    templateUrl: './healthcare.component.html'
})

export class HealthCareComponent implements OnChanges {
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
