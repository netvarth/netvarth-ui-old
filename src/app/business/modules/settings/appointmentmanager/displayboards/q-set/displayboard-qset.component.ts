import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';

@Component({
    selector: 'app-displayboard-qset-appt',
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
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor
    ) { }

    ngOnInit() {
        this.getDisplayboardQsets();
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
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
        this.provider_services.getDisplayboardQSetsAppointment()
            .subscribe(
                data => {
                    this.board_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.wordProcessor.apiErrorAutoHide(this, error);
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
        this.provider_services.deleteDisplayboardQSetAppointment(board.id).subscribe(
            () => {
                this.getDisplayboardQsets();
                this.refresh = true;
            }
        );
    }
}
