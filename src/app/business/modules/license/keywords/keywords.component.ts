import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html'
})

export class KeywordsComponent {
    constructor(
        private routerobj: Router,
    ) { }
    redirecToLicenseInvoice() {
        this.routerobj.navigate(['provider', 'license']);
    }
}
