import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-displayboard-qset',
    templateUrl: './displayboard-qset.component.html'
})
export class DisplayboardQSetComponent implements OnInit {
    refresh = false;
    api_loading: boolean;
    board_list: any = [];
    domain: any;
    go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
    @Input() source;
    @Output() idSelected = new EventEmitter<any>();
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    constructor(
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
    ) { }

    ngOnInit() {
        this.getDisplayboardQsets();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }
    goBack() {
        const actionObj = {
            source: this.source
        };
        if (this.refresh) {
            actionObj['refresh'] = true;
        }
        this.idSelected.emit(actionObj);
    }

    getDisplayboardQsets() {
        this.api_loading = true;
        this.board_list = [];
        this.provider_services.getDisplayboardQSetsWaitlist()
            .subscribe(
                data => {
                    this.board_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/displayboard->board']);
        }
    }
    addQSet() {
        const actionObj = {
            action: 'add',
            id: null,
            source: 'QLIST'
        };
        this.idSelected.emit(actionObj);
    }
    editDisplayboardQSet(board) {
        const actionObj = {
            action: 'edit',
            id: board.id,
            source: 'QLIST'
        };
        this.idSelected.emit(actionObj);
    }
    goDisplayboardQSetDetails(board) {
        const actionObj = {
            action: 'view',
            id: board.id
        };
        this.idSelected.emit(actionObj);
    }
    deleteDisplayboardQSet(board) {
        this.provider_services.deleteDisplayboardQSetWaitlist(board.id).subscribe(
            () => {
                this.getDisplayboardQsets();
                this.refresh = true;
            }
        );
    }
}
