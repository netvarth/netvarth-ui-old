import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})


export class BreadCrumbComponent implements OnInit, OnChanges {

    lear_more_cap = Messages.LEARN_MORE_CAP;

    @Input() breadcrumbs;
    @Input() moreOptions: any = [];
    @Output() performAction: EventEmitter<any> = new EventEmitter();
    className = '';
    constructor(
        public router: Router,
        private sharedfunctionObj: SharedFunctions
    ) { }
    ngOnChanges() {
        if (this.moreOptions.classname) {
            this.className = this.moreOptions.classname;
        }
        delete this.moreOptions.classname;
    }
    ngOnInit() {
        if (this.moreOptions.classname) {
            this.className = this.moreOptions.classname;
        }
        delete this.moreOptions.classname;
    }
    btn_clicked(action) {
        this.performAction.emit(action);
    }
    goNavigate(breadcrumb) {
        if (breadcrumb.url) {
            this.router.navigateByUrl(breadcrumb.url);
        }
    }
    learnmore_clicked() {
        const pdata = { 'ttype': 'learn_more', 'target': this.moreOptions };
        this.sharedfunctionObj.sendMessage(pdata);
    }

}
