import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-viewprevstatement',
    templateUrl: './viewprevstatement.component.html'
})
export class ViewPrevStatementComponent implements OnInit {
    data: any;
    apiloading = false;
    constructor(
        private router: Router,
        private activated_route: ActivatedRoute,
    ) {
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.data = qParams;
                console.log(this.data);
            });
    }
    ngOnInit() {

    }
}
