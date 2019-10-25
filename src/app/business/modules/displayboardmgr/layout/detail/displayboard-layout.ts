import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-layout',
    templateUrl: './displayboard-layout.html'
})
export class DisplayboardLayoutComponent implements OnInit {

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
    layoutData: any = [];
    boardSelectedItems: any = {};
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];


    // selectedRows = 1;
    // selectedCols = 1;

    action = 'show';
    api_loading: boolean;
    name;
    layout = this.boardLayouts[0];
    displayName;
    metric: any = [];
    metricSelected = {};
    id;
    board_list: any = [];
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
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Layouts',
            url: '/provider/settings/displayboard/layout'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute
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
        this.getDisplayboards();
    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
    handleLayout(layout) {
        console.log(layout);
        this.boardRows = layout.row;
        this.boardCols = layout.col;
    }
    editLayoutbyId(id) {
        this.provider_services.getBoardLayout(id).subscribe(data => {
            this.layoutData = data;
            console.log(this.layoutData);
            console.log(this.displayBoardData);
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
            console.log(layoutPosition[0]);
            console.log(layoutPosition[1]);
            this.boardRows = layoutPosition[0];
            this.boardCols = layoutPosition[1];
            this.layoutData.metric.forEach(element => {
                this.boardSelectedItems[element.position] = element.sbId;
                this.metricSelected[element.position] = element.sbId;
                console.log(element);
            });
            console.log(this.boardSelectedItems);
        });
    }
    handleLayoutMetric(selectedItem, position) {
        console.log(position + ':' + selectedItem);
        this.metricSelected[position] = selectedItem;
    }
    onSubmit() {
        for (let i = 0; i < this.boardRows; i++) {
            for (let j = 0; j < this.boardCols; j++) {
                this.metric.push({ 'position': i + '_' + j, 'sbId': this.metricSelected[i + '_' + j] });
            }
        }
        console.log(this.metric);
        if (this.actionparam === 'add') {
            const post_data = {
                'name': this.name,
                'layout': this.layout.value,
                'displayName': this.displayName,
                'metric': this.metric,
            };
            this.provider_services.createBoardLayout(post_data).subscribe(data => {
                this.editLayoutbyId(data);
                this.actionparam = 'view';
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.layoutData.id,
                'name': this.name,
                'layout': this.layout.value,
                'displayName': this.displayName,
                'metric': this.metric
            };
            this.provider_services.updateBoardLayout(post_data).subscribe(data => {
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
        this.actionparam = 'view';
    }
    getDisplayboards() {
        this.api_loading = true;
        this.board_list = [];
        this.provider_services.getDisplayboards()
            .subscribe(
                data => {
                    this.board_list = data;

                    console.log(this.board_list);
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
}
