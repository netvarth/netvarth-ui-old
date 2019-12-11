import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-details',
    templateUrl: './displayboard-details.component.html'
})
export class DisplayboardDetailComponent implements OnInit {
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    layout_id;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    statussel = false;
    statussel1 = false;
    statusse2 = false;
    statussel3 = false;
    showMode = 'DBOARD';
    // showQsets = true;
    // showQset = false;
    layoutData: any = [];
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    boardSelectedItems: any = {};
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    action = 'show';
    api_loading: boolean;
    name;
    layout = this.boardLayouts[0];
    displayName;
    metric: any = [];
    metricSelected = {};
    id;
    qset_list: any = [];
    displayBoardData: any = [];
    boardLayoutFields = {};
    boardRows = 1;
    boardCols = 1;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'Queue Statusboard',
            url: '/provider/settings/q-manager/displayboards'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    qsetAction;
    qsetId;
    showDboard = true;
    source;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private shared_Functionsobj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private router: Router
    ) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.layout_id = qparams.id;
                if (this.layout_id) {
                    this.editLayoutbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
    }
    addQSet() {
        this.qsetAction = 'add';
        this.showMode = 'QSET';
        this.source = 'DBOARD';
        this.qsetId = null;
    }
    qSetSelected(qset) {
        if (qset.refresh) {
            this.getDisplayboardQSets();
        }
        if (qset.source === 'QLIST' && !qset.action) {
            this.source = 'DBOARD';
            this.showMode = 'QSETS';
        } else if (qset.source === 'DBOARD') {
            this.showMode = 'DBOARD'; // when click back to statusboard button
        } else {
            this.showDboard = false;
            this.qsetAction = qset.action;
            this.qsetId = qset.id;
            this.source = qset.source;
            this.showMode = 'QSET';
        }
    }
    qSetListClicked() {
        this.source = 'DBOARD';
        this.showMode = 'QSETS';
    }
    getLayout(layoutvalue) {
        let layoutActive;
        for (let i = 0; i < this.boardLayouts.length; i++) {
            if (this.boardLayouts[i].value === layoutvalue) {
                layoutActive = this.boardLayouts[i];
                break;
            }
        }
        return layoutActive;
    }
    ngOnInit() {
        this.getDisplayboardQSets();
    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
    handleLayout(layout) {
        this.boardRows = layout.row;
        this.boardCols = layout.col;
    }
    editLayoutbyId(id) {
        this.provider_services.getDisplayboard(id).subscribe(data => {
            this.layoutData = data;
            this.layout = this.getLayout(this.layoutData.layout);
            this.displayBoardData = data;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: this.layoutData.displayName
            });
            this.breadcrumbs = breadcrumbs;
            this.name = this.layoutData.name;
            this.displayName = this.layoutData.displayName;
            // this.layout = this.layoutData.layout;
            this.id = this.layoutData.id;
            const layoutPosition = this.layoutData.layout.split('_');
            this.boardRows = layoutPosition[0];
            this.boardCols = layoutPosition[1];
            this.layoutData.metric.forEach(element => {
                this.boardSelectedItems[element.position] = element.sbId;
                this.metricSelected[element.position] = element.sbId;
            });
        });
    }
    handleLayoutMetric(selectedItem, position) {
        this.metricSelected[position] = selectedItem;
    }
    onSubmit() {
        let name = '';
        if (this.displayName) {
            name = this.displayName.trim().replace(/ /g, '_');
        }
        for (let i = 0; i < this.boardRows; i++) {
            for (let j = 0; j < this.boardCols; j++) {
                this.metric.push({ 'position': i + '_' + j, 'sbId': this.metricSelected[i + '_' + j] });
            }
        }
        if (this.actionparam === 'add') {
            const post_data = {
                'name': name,
                'layout': this.layout.value,
                'displayName': this.displayName,
                'metric': this.metric,
            };
            this.provider_services.createDisplayboard(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_ADD'), { 'panelclass': 'snackbarerror' });
                this.editLayoutbyId(data);
                this.actionparam = 'view';
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
            // } else {
            //     this.shared_Functionsobj.openSnackBar('Please enter the display name', { 'panelClass': 'snackbarerror' });
            // }
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.layoutData.id,
                'name': name,
                'layout': this.layout.value,
                'displayName': this.displayName,
                'metric': this.metric
            };
            this.provider_services.updateDisplayboard(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                this.editLayoutbyId(this.layoutData.id);
                this.actionparam = 'view';
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    onCancel() {
        if (this.actionparam === 'edit') {
            this.actionparam = 'view';
        } else {
            this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
        }
    }
    getDisplayboardQSets() {
        this.api_loading = true;
        this.qset_list = [];
        this.provider_services.getDisplayboardQSets()
            .subscribe(
                data => {
                    this.qset_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    editlayout(id) {
        this.actionparam = 'edit';
        this.editLayoutbyId(id);
    }
    resetApiErrors() {
    }
    // gotoAddQset() {
    //     this.router.navigate(['/provider/settings/q-manager/displayboards/q-set/add']);
    // }
}
