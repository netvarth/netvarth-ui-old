import { Component, ViewChild, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { MatSelect } from '@angular/material';
import { take, takeUntil, startWith, map } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import value from '*.json';


interface Bank {
    id: string;
    name: string;
}

@Component({
    selector: 'app-displayboard-details',
    templateUrl: './displayboard-details.component.html'
})
export class DisplayboardDetailComponent implements OnInit {

    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();

    /** control for the selected bank for multi-selection */
    public bankMultiCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword multi-selection */
    public qBoardFilterMultictrl: FormControl = new FormControl();

    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

    /** list of banks filtered by search keyword for multi-selection */
    public filteredQboardsMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

    @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();

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
    containerName;
    layout = this.boardLayouts[0];
    displayName;
    serviceRoom;
    metric: any = [];
    metricSelected = {};
    id;
    qset_list: any = [];
    filteredQboardList;
    qboard_list: any = [];
    displayBoardData: any = [];
    selectedQboardlist: any = [];
    sbDetailslist: any = [];
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
            title: 'QBoard',
            url: '/provider/settings/q-manager/displayboards'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    qsetAction;
    qsetId;
    showDboard = true;
    source;
    qboardSelected = false;
    refreshInterval;
    nestedRefreshInterval;
    sbIds;
    headers = 1;
    footers = 2;
    headerSetting = false;
    footerSetting = false;
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
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.value === 'view') {
                this.actionparam = qparams.value;
            }
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
        this.filteredOptions = this.myControl.valueChanges.pipe(
            // tslint:disable-next-line:no-shadowed-variable
            startWith(''), map(value => this._filter(value))
        );


        this.getDisplayboardQSets();
        this.qBoardFilterMultictrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBanksMulti();
            });
        // load qboard list
        this.getQboardlist();

    }
    // tslint:disable-next-line:no-shadowed-variable
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
    private filterBanksMulti() {
        if (!this.qboard_list) {
            return;
        }
        // get the search keyword
        let search = this.qBoardFilterMultictrl.value;
        console.log(this.qBoardFilterMultictrl.value);
        if (!search) {
            this.filteredQboardList = this.qboard_list.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredQboardList = this.qboard_list.filter(qboard => qboard.name.toLowerCase().indexOf(search) > -1);
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
        this.provider_services.getDisplayboardWaitlist(id).subscribe(data => {
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
            this.serviceRoom = this.layoutData.serviceRoom;
            this.id = this.layoutData.id;
            const layoutPosition = this.layoutData.layout.split('_');
            this.boardRows = layoutPosition[0];
            this.boardCols = layoutPosition[1];
            if (this.layoutData.metric) {
                this.layoutData.metric.forEach(element => {
                    this.boardSelectedItems[element.position] = element.sbId;
                    this.metricSelected[element.position] = element.sbId;
                });
            }
        });
    }
    handleLayoutMetric(selectedItem, position) {
        this.metricSelected[position] = selectedItem;
    }
    headerClick() {
        this.headerSetting = true;
    }
    footerClick() {
        this.footerSetting = true;
    }
    onSubmit() {
        this.metric = [];
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
                'serviceRoom': this.serviceRoom,
                'metric': this.metric,
            };
            this.provider_services.createDisplayboardWaitlist(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_ADD'), { 'panelclass': 'snackbarerror' });
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
                'name': name,
                'displayName': this.displayName,
                'serviceRoom': this.serviceRoom
            };
            if (this.layoutData.isContainer) {
                post_data['isContainer'] = this.layoutData.isContainer;
            } else {
                post_data['metric'] = this.metric;
                post_data['layout'] = this.layout.value;
            }
            this.provider_services.updateDisplayboardWaitlist(post_data).subscribe(data => {
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
        this.provider_services.getDisplayboardQSetsWaitlist()
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
    getQboardlist() {
        this.api_loading = true;
        this.qboard_list = [];
        this.provider_services.getDisplayboardsWaitlist()
            .subscribe(
                data => {
                    this.qboard_list = data;
                    this.filteredQboardList = data;
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
    clearQboardSelected() {
        this.qBoardFilterMultictrl.reset();
        this.nestedRefreshInterval = '';
    }
    addBtnClicked() {
        this.selectedQboardlist.push({ 'qBoard': this.qBoardFilterMultictrl.value.displayName, 'interval': this.nestedRefreshInterval });
        this.sbDetailslist.push({ 'sbId': this.qBoardFilterMultictrl.value.id, 'sbInterval': this.nestedRefreshInterval });
        this.clearQboardSelected();
    }
}
