import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-personalcare-learnmore',
    templateUrl: './personalcare.component.html'
})

export class PersonalCareComponent implements OnChanges {
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
