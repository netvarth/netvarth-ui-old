import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-professional-learnmore',
    templateUrl : './professional.component.html'
})

export class ProfessionalCareComponent implements OnChanges {
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
