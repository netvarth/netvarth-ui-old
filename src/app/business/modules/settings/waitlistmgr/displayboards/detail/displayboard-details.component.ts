import { Component, ViewChild, OnInit,HostListener } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NavigationExtras } from '@angular/router';

import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';

import { Router, ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { interval as observableInterval, Subscription } from 'rxjs';
import { ProviderServices } from '../../../../../../business/services/provider-services.service';



interface Bank {
    id: string;
    name: string;
}

@Component({
    selector: 'app-displayboard-details',
    templateUrl: './displayboard-details.component.html',
    styleUrls: ['../displayboards.component.css']
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

    @ViewChild('singleSelect') singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();

    amForm: FormGroup;
    boardData: any;
    selectedBoardData: any = [];
    colLength;
    selectedDisplayboards: any = {};
    boardHeight;
    fullHeight;
    colSpanLength;
    bname;
    blogo = '';
    metricElement;
    MainBlogo;
    bProfile: any = [];
    qualification: any = [];
    subDomVirtualFields: any = [];
    accountType;
    MainBname;
    locId;
    provider_id;
    businessJson: any = [];

    //refreshTime = projectConstants.INBOX_REFRESH_TIME;
    cronHandle1: Subscription;

    index;
    bProfiles: any = [];
    inputStatusboards: any = [];
    tabid: any = {};
    manageTabCalled = false;
    s3Url;
    showIndex = 0;
    roomName = '';
    is_image: boolean;
    position: any;
    width: any;
    height: any;
    isContainer = false;
    qBoardTitle: any;
    qBoardFooter;
    qBoardGroupFooter: any;
    qBoardGroupTitle: any;
    bLogoWidth = '';
    bLogoHeight = '';
    gLogoWidth = '';
    gLogoHeight = '';
    glogo = '';
    gPosition;
    customer_label = '';
    displayboardDetails: any;
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
    type;
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
    tableChange = false;
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
    qBoardscaption = 'Add QBoard';
    QBoardData: any;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public _sanitizer: DomSanitizer,

        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private activated_route: ActivatedRoute,
        private router: Router
    ) {


        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
            // this.layout_id = params.id;
            // console.log("Layout_id ",this.layout_id);
        }
        );
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.value === 'view') {
                this.qBoardscaption = 'QBoard Details';
                this.actionparam = qparams.value;
                this.layout_id = qparams.id;
                console.log("View Layout Id :", this.layout_id);

            }
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                if (qparams.value === 'view') {
                    this.layout_id = qparams.id;
                    console.log("DisplayBoard Value Layout Id:", qparams.id);

                    if (this.layout_id) {
                        this.editLayoutbyId(qparams.id);
                        console.log("DisplayBoard Edit Layout :", this.editLayoutbyId(qparams.id));


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
                }
            });
        // this.activated_route.params.subscribe(
        //     qparams => {
        //         this.layout_id = qparams.id;
        //         this.QBoardData = qparams.metric;
        //         console.log("DisplayBoard Layout :", this.layout_id, this.QBoardData);
        //     });
        // this.activated_route.queryParams.subscribe(
        //     queryparams => {
        //         if (queryparams.type === 'wl') {
        //             this.type = 'waitlist';
        //             console.log("DisplayBoard :", this.type)
        //         } else {
        //             this.type = 'appointment';
        //         }
        //     });

    }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        const screenHeight = window.innerHeight;
        let hgt_reduced = 200;
        let fullhgt_reduced = 165;
        if (this.isContainer) {
            hgt_reduced = 320;
            fullhgt_reduced = 270;
        }
        if (this.bLogoHeight === '') {
            hgt_reduced = 136;
            fullhgt_reduced = 86;
        }
        this.fullHeight = screenHeight - fullhgt_reduced;
        if (this.boardRows > 1) {
            this.boardHeight = (screenHeight - hgt_reduced) / 2;
        } else {
            this.boardHeight = (screenHeight - hgt_reduced);
        }
    }

  

    editDisplayboardQSet(board) {
        const actionObj = {
            action: 'edit',
            id: board.id,
            source: 'QLIST'
        };
       // this.idSelected.emit(actionObj);
       this.qSetSelected(actionObj);
    }

    ViewDisplayboardLayout(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                value: 'view',
                id: layout.id
            }
        };

        this.router.navigate(['provider', 'settings', 'q-manager',
            'displayboards', 'view'], navigationExtras);
        this.tableChange = !this.tableChange;

        // this.editlayout(this.layout_id)

        // this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'q-set','view'],navigationExtras);

    }



    addQSet() {
        this.qsetAction = 'add';
        this.qBoardscaption = 'Add QBoard query';
        this.showMode = 'QSET';
        this.source = 'DBOARD';
        this.qsetId = null;
    }


    goDisplayboardLayoutDetails(layout, source?) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: layout.id }
        };
        this.router.navigate(['provider', 'settings', 'q-manager',
            'displayboards', 'add'], navigationExtras);

        console.log("Layout : ", navigationExtras);
        // if (source) {
        //     const path = 'displayboard/' + layout.id + '?type=wl';
        //     // const path = projectConstantsLocal.PATH + 'displayboard/' + layout.id + '?type=wl';
        //     window.open(path, '_blank');
        // }

        // else {
        //     const navigationExtras: NavigationExtras = {
        //         queryParams: { id: layout.id }
        //     };
        //     this.router.navigate(['provider', 'settings', 'q-manager',
        //         'displayboards', 'view'], navigationExtras);
        // }
    }

    qSetSelected(qset) {
        console.log("Qset Id : ", qset);
        if (qset.refresh) {
            this.getDisplayboardQSets();
        }
        if (qset.source === 'QLIST' && !qset.action) {
            this.qBoardscaption = 'QBoard queries';
            this.source = 'DBOARD';
            this.showMode = 'QSETS';
        } else if (qset.source === 'DBOARD') {
            this.qBoardscaption = 'Add QBoard';
            this.showMode = 'DBOARD'; // when click back to statusboard button
        } else {
            this.qBoardscaption = 'Add QBoard query';
            this.showDboard = false;
            this.qsetAction = qset.action;
            this.qsetId = qset.id;
            this.source = qset.source;
            this.showMode = 'QSET';
        }
    }
    qSetListClicked() {
        this.qBoardscaption = 'QBoard queries';
        this.source = 'DBOARD';
        this.showMode = 'QSETS';
    }
    editQuerySet(qset){
        console.log("Query Set Id : ",qset);

    }

    // qSetViewClicked() {
    //     //this.qBoardscaption = 'QBoard queries';
    //     this.source = 'DBOARD';
    //     this.showMode = 'QSET';
    // }
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
        console.log("Layout :", layout);
    }
    onServiceForChange(layout) {

        this.boardRows = layout.row;
        this.boardCols = layout.col;
        console.log("Layout :", layout);
    }
    onClickChange() {
        this.tableChange = !this.tableChange;

    }

    initBoard() {
        this.provider_services.getDisplayboardById_Type(this.layout_id, this.type).subscribe(
            (displayboard_data: any) => {
                this.displayboardDetails = displayboard_data;
                console.log("DisplayBoard Details : ", this.displayboardDetails);
                if (displayboard_data.isContainer) {
                    this.inputStatusboards = displayboard_data.containerData;
                    this.showIndex = 0;
                    this.isContainer = true;
                    if (displayboard_data['headerSettings']) {
                        this.qBoardGroupTitle = displayboard_data['headerSettings']['title1'] || '';
                    }
                    if (displayboard_data['footerSettings']) {
                        this.qBoardGroupFooter = displayboard_data['footerSettings']['title1'] || '';
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = displayboard_data.logoSettings.logo;
                            this.glogo = logoObj['url'];
                        }
                        this.gPosition = displayboard_data.logoSettings['position'];
                        if (displayboard_data.logoSettings.height && displayboard_data.logoSettings.width) {
                            this.gLogoWidth = displayboard_data.logoSettings['width'];
                            this.gLogoHeight = displayboard_data.logoSettings['height'];
                        } else {
                            this.gLogoWidth = '100';
                            this.gLogoHeight = '100';
                        }
                    }
                    this.getStatusboard(this.inputStatusboards[this.showIndex]);
                    this.cronHandle1 = observableInterval(this.inputStatusboards[this.showIndex].sbInterval * 1000).subscribe(() => {
                        if (this.showIndex === (this.inputStatusboards.length - 1)) {
                            this.showIndex = 0;
                        } else {
                            ++this.showIndex;
                        }
                        this.getStatusboard(this.inputStatusboards[this.showIndex]);
                    });
                } else {
                    this.roomName = displayboard_data['serviceRoom'];
                    if (displayboard_data.headerSettings && displayboard_data.headerSettings['title1']) {
                        this.qBoardTitle = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.headerSettings['title1']);
                    }
                    if (displayboard_data.footerSettings && displayboard_data.footerSettings['title1']) {
                        this.qBoardFooter = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.footerSettings['title1']);
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = displayboard_data.logoSettings.logo;
                            this.blogo = logoObj['url'];
                        }
                        this.position = displayboard_data.logoSettings['position'];
                        if (displayboard_data.logoSettings.height && displayboard_data.logoSettings.width) {
                            this.bLogoWidth = displayboard_data.logoSettings['width'];
                            this.bLogoHeight = displayboard_data.logoSettings['height'];
                        } else {
                            this.bLogoWidth = '100';
                            this.bLogoHeight = '100';
                        }
                    }
                    const layoutPosition = displayboard_data.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    // this.onResize();
                    this.boardCols = layoutPosition[1];
                    displayboard_data.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                    this.cronHandle1 = observableInterval(10000).subscribe(() => {
                        displayboard_data.metric.forEach(element => {
                            this.metricElement = element;
                            this.selectedDisplayboards[element.position] = {};
                            this.setDisplayboards(this.metricElement);
                        });
                    });
                    this.api_loading = false;
                }
            },
            (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.router.navigate(['/']);
            });
    }


    getStatusboard(boardObj) {
        if (boardObj.sbId) {
            this.roomName = '';
            this.api_loading = true;
            this.provider_services.getDisplayboardById_Type(boardObj.sbId, this.type).subscribe(
                (displayboard_data: any) => {
                    this.roomName = displayboard_data['serviceRoom'];
                    if (displayboard_data.headerSettings && displayboard_data.headerSettings['title1']) {
                        this.qBoardTitle = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.headerSettings['title1']);
                    }
                    if (displayboard_data.footerSettings && displayboard_data.footerSettings['title1']) {
                        this.qBoardFooter = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.footerSettings['title1']);
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = displayboard_data.logoSettings.logo;
                            this.blogo = logoObj['url'];
                        }
                        this.position = displayboard_data.logoSettings['position'];
                        this.bLogoWidth = displayboard_data.logoSettings['width'];
                        this.bLogoHeight = displayboard_data.logoSettings['height'];
                    }
                    const layoutPosition = displayboard_data.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    //this.onResize();
                    this.boardCols = layoutPosition[1];
                    displayboard_data.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                    this.api_loading = false;
                });
        }
    }

    setDisplayboards(element) {
        console.log(element);
        const displayboard = element.queueSet;
        this.selectedDisplayboards[element.position]['board'] = displayboard;
        const Mfilter = displayboard.queryString;
        if (this.type === 'waitlist') {
            this.provider_services.getTodayWaitlistFromStringQuery(Mfilter).subscribe(
                (waitlist: any) => {
                    const filteredList = waitlist.filter(wt => wt.service.serviceType === 'physicalService');
                    this.selectedDisplayboards[element.position]['checkins'] = filteredList;
                });
        } else {
            this.provider_services.getTodayAppointmentsFromStringQuery(Mfilter).subscribe(
                (waitlist: any) => {
                    const filteredList = waitlist.filter(wt => wt.service.serviceType === 'physicalService');
                    this.selectedDisplayboards[element.position]['checkins'] = filteredList;
                });
        }

    }




    editLayoutbyId(id) {
        this.provider_services.getDisplayboardWaitlist(id).subscribe(data => {
            this.layoutData = data;
            console.log("DisplayBoard Edit LayoutById :", this.layoutData);

            this.layout = this.getLayout(this.layoutData.layout);
            console.log("Layout Edit :", this.layout);
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
                console.log("BoardSelectedItems :", this.layoutData.metric);
                // console.log("Selected :", this.layoutData.metric[layoutPosition]);


            }


            for (var i = 0; i < this.layoutData.metric.length; i++) {

                this.boardData = this.layoutData.metric[i];
                for (var j = 0; j < this.boardData['queueSet']['fieldList'].length; j++) {
                    this.colLength = this.boardData['queueSet']['fieldList'].length
                    this.selectedBoardData[j] = this.boardData['queueSet']['fieldList'][j];
                    // console.log("selectedBoardData ", this.selectedBoardData);
                    console.log("Board Data", this.selectedBoardData[j]);

                }

            }

            this.createRange(this.selectedBoardData);

        });
    }
    handleLayoutMetric(selectedItem, position) {
        this.metricSelected[position] = selectedItem;
        console.log("Qset Id Edit : ",selectedItem)
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
            console.log("Data :", post_data)
            this.provider_services.createDisplayboardWaitlist(post_data).subscribe(data => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('DISPLAYBOARD_ADD'), { 'panelclass': 'snackbarerror' });
                this.editLayoutbyId(data);
                this.actionparam = 'view';
                this.qBoardscaption = 'QBoard Details';
                this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);

            },
                error => {
                    this.api_loading = false;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                this.editLayoutbyId(this.layoutData.id);
                this.actionparam = 'view';
                this.qBoardscaption = 'QBoard Details';
            },
                error => {
                    this.api_loading = false;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
            // this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);

        }

    }
    onCancel() {
        if (this.actionparam === 'edit') {
            this.qBoardscaption = 'QBoard Details';
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
                    this.wordProcessor.apiErrorAutoHide(this, error);
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
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    editlayout(id) {
        console.log("Edit layout Id :", id);
        this.actionparam = 'edit';
        this.qBoardscaption = 'Edit QBoard';
        // this.qsetAction = id.action;
        // this.qsetId = id.id;
        // this.source = id.source;
        // this.showMode = 'QSET';
        // this.source = 'DBOARD';
        // this.showMode = 'QSET';
        this.editLayoutbyId(id);
    }

    viewQueryById(id) {
        console.log("View Query Id :", id);
        this.source = 'DBOARD';
        this.showMode = 'QSET';
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
    redirecToQmanager() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
    }
    redirecToHelp() {

    }
    toBack() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
    }
}
