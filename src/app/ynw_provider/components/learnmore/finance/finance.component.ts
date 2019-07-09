import { Component, Input, OnChanges } from '@angular/core';
@Component({
    selector: 'app-finance-learnmore',
    templateUrl: './finance.component.html'
})
export class FinanceComponent implements OnChanges {
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
