import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from '../../../show-messages/show-messages.component';

@Component({
    selector: 'app-displayboards',
    templateUrl: './displayboards.component.html'
})
export class DisplayboardsComponent implements OnInit {
    tooltipcls = '';
    add_button = '';
    breadcrumb_moreoptions: any = [];
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
            title: 'QBoards'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    api_loading: boolean;
    action = 'list';
    layout_list: any = [];
    button_title = 'Save';
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    accountId;
    statusboard_cap = Messages.DISPLAYBOARD_HEADING;
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    container_count = 0;
    accountType: any;
    qBoardsSelectedIndex: any = [];
    qBoardSelectCount = 0;
    qBoardsSelected: any = [];
    displayName: any;
    qBoards: any = [];
    cancel_btn = Messages.CANCEL_BTN;
    refreshInterval = 10;
    serviceRoom: any;
    enableAddGroup = false;
    qBoardsActive: any = [];
    qBoardsNotSelected = [];
    hideAddToGroup = false;
    sel_QBoard: any;
    activeGroup: any;
    qBoardscaption = 'QBoards';
    usage_metric;
    adon_total: any;
    adon_info: any;
    adon_used: any;
    use_metric;
    warningdialogRef: any;
    disply_name: any;
    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) { }
    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'q-manager->settings-q-boards', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.getDisplayboardLayouts();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        this.accountId = this.shared_functions.getitemFromGroupStorage('accountId');
        this.domain = user.sector;
        this.getLicenseUsage();
    }
    getDisplayboardLayouts() {
        this.api_loading = true;
        this.layout_list = [];
        this.provider_services.getDisplayboardsWaitlist()
            .subscribe(
                (data: any) => {
                    const alldisplayBoards = data;
                    this.layout_list = [];
                    this.qBoardsActive = [];
                    // let count = 0;
                    alldisplayBoards.forEach(element => {
                        this.layout_list.push(element);
                        if (element.isContainer) {
                            // count++;
                        } else {
                            this.qBoardsActive.push(element);
                        }
                    });
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(action) {
        this.addDisplayboardLayout();
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-q-boards']);
        }
    }
    addDisplayboardLayout() {
        if (this.adon_total === this.adon_used) {
            this.warningdialogRef = this.dialog.open(ShowMessageComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'popup-class'],
                disableClose: true,
                data: {
                    warn: this.disply_name
                }
            });
            this.warningdialogRef.afterClosed().subscribe(result => {

            });
        } else {
            this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'add']);
        }
    }

    addDisplayboardGroup() {
        this.action = 'addToGroup';
        this.qBoardscaption = 'Qboard group';
        this.qBoardsSelected = [];
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
        });
        breadcrumbs.push({
            title: 'Group'
        });
        this.breadcrumbs = breadcrumbs;

        if (this.qBoardSelectCount > 0) {
            for (let i = 0; i < this.layout_list.length; i++) {
                if (this.qBoardsSelectedIndex[i]) {
                    const qBoard = this.layout_list[i];
                    qBoard['refreshInterval'] = 10;
                    this.qBoardsSelected.push(qBoard);
                }
            }
        }
        this.qBoardsNotSelected = this.qBoardsActive.slice();
        if (this.qBoardsSelected.length === this.qBoardsActive.length) {
            this.hideAddToGroup = true;
        }
        this.qBoardsSelected.forEach(sb => {
             this.qBoardsNotSelected = this.removeByAttr( this.qBoardsNotSelected, 'id', sb.sbId);
         });
    }

    listContainers() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'containers']);
    }
    gotoDisplayboardQSet() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'q-set']);
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
    }
    addToQBoardGroup(sel_QBoard, refreshInterval) {
        if (!this.sel_QBoard) {
            return false;
        }
        const qBoard = {};
        this.sel_QBoard = sel_QBoard;
        qBoard['id'] = this.sel_QBoard.id;
        const qboard = this.sel_QBoard;
        qBoard['displayName'] = qboard.displayName;
        qBoard['refreshInterval'] = refreshInterval;
        this.qBoardsSelected.push(qBoard);
        if (this.qBoardsSelected.length === this.qBoardsActive.length) {
            this.hideAddToGroup = true;
        }
        this.enableAddGroup = false;
    }
    cancelAddToQBoardGroup() {
        this.enableAddGroup = false;
    }
    editDisplayboardLayout(layout) {
        if (layout.isContainer) {
            this.action = 'updateGroup';
            this.button_title = 'Update';
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: layout.displayName
            });
            this.breadcrumbs = breadcrumbs;

            this.provider_services.getDisplayboardWaitlist(layout.id).subscribe((data: any) => {
                this.displayName = data.displayName;
                this.serviceRoom = data.serviceRoom;
                this.activeGroup = data;
                this.qBoardsSelected = [];
                this.qBoardsNotSelected = this.qBoardsActive.slice();
                this.hideAddToGroup = false;
                if (data.containerData.length === this.qBoardsActive.length) {
                    this.hideAddToGroup = true;
                }
                data.containerData.forEach(sb => {
                    const qBoard = {};
                    qBoard['id'] = sb.sbId;
                    const qboard = this.getQBoard(sb.sbId);
                    qBoard['displayName'] = qboard.displayName;
                    qBoard['refreshInterval'] = sb.sbInterval;
                    this.qBoardsSelected.push(qBoard);
                    this.qBoardsNotSelected = this.removeByAttr( this.qBoardsNotSelected, 'id', sb.sbId);
                });
            });

        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: { id: layout.id }
            };
            this.router.navigate(['provider', 'settings', 'q-manager',
                'displayboards', 'edit'], navigationExtras);
        }
    }
    removeByAttr = function (arr, attr, value) {
        let i = arr.length;
        while (i--) {
            if (arr[i] && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {
                arr.splice(i, 1);
            }
        }
        return arr;
    };
    removeFromGroup(qBoard) {
        if (this.qBoardsSelected.length > 1) {
            this.qBoardsSelected = this.removeByAttr( this.qBoardsSelected, 'id', qBoard.id);
            this.qBoardsNotSelected.push(qBoard);
        }
        if (this.qBoardsSelected.length === this.qBoardsActive.length) {
            this.hideAddToGroup = true;
        }
    }
    getQBoard(sbId) {
        let board = null;
        for (let i = 0; i < this.layout_list.length; i++) {
            if (!this.layout_list[i].isContainer) {
                if (this.layout_list[i].id === sbId) {
                    board = this.layout_list[i];
                    break;
                }
            }
        }
        return board;
    }
    enableAddToGroup() {
        this.enableAddGroup = true;
    }
    getDisplayboardContainers() {
        this.provider_services.getDisplayboardContainers()
            .subscribe(
                (data: any) => {
                    this.container_count = data.length;
                });
    }
    goDisplayboardLayoutDetails(layout, source?) {
        if (source) {
            const path = projectConstants.PATH + 'displayboard/' + layout.id + '?type=wl';
            window.open(path, '_blank');
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: { id: layout.id }
            };
            this.router.navigate(['provider', 'settings', 'q-manager',
                'displayboards', 'view'], navigationExtras);
        }
    }
    deleteDisplayboardLayout(layout) {
        this.provider_services.deleteDisplayboardWaitlist(layout.id).subscribe(
            () => {
                this.getDisplayboardLayouts();
            }
        );
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
    qBoardClicked(index) {
        if (this.qBoardsSelectedIndex[index]) {
            delete this.qBoardsSelectedIndex[index];
            this.qBoardSelectCount--;
        } else {
            this.qBoardsSelectedIndex[index] = true;
            this.qBoardSelectCount++;
        }
    }
    onCancel() {
        this.qBoardscaption = 'QBoards';
        this.breadcrumbs = this.breadcrumbs_init;
        this.activeGroup = null;
        this.action = 'list';
    }
    saveQBoardGroup() {
        this.qBoardscaption = 'QBoards';
        let name = '';
        if (this.displayName) {
            name = this.displayName.trim().replace(/ /g, '_');
        }
        const sbDetails = [];
        this.qBoardsSelected.forEach(qboard => {
            const tmpQBoard = {};
            tmpQBoard['sbId'] = qboard.id;
            tmpQBoard['sbInterval'] = qboard.refreshInterval;
            tmpQBoard['accountId'] = this.accountId;
            sbDetails.push(tmpQBoard);
        });
        if (this.action === 'addToGroup') {
            const post_data = {
                'name': name,
                'layout': '1_1',
                'displayName': this.displayName,
                'interval': this.refreshInterval,
                'serviceRoom': this.serviceRoom,
                'containerData': sbDetails,
                'isContainer': true
            };
            this.provider_services.createDisplayboardWaitlist(post_data).subscribe(data => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('DISPLAYBOARD_ADD'), { 'panelclass': 'snackbarerror' });
                this.onCancel();
                this.getDisplayboardLayouts();
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
             } else if (this.action === 'updateGroup') {
                const post_data = {
                    'id': this.activeGroup.id,
                    'name': name,
                    'layout': '1_1',
                    'displayName': this.displayName,
                    'interval': this.refreshInterval,
                    'serviceRoom': this.serviceRoom,
                    'containerData': sbDetails,
                    'isContainer': true
                    };
                this.provider_services.updateDisplayboardWaitlist(post_data).subscribe(data => {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                    this.onCancel();
                    this.getDisplayboardLayouts();
                },
                    error => {
                        this.api_loading = false;
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
            }
    }
    redirecToQmanager() {
        this.routerobj.navigate(['provider', 'settings' , 'q-manager' ]);
    }
      redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-q-boards']);
    }
    getLicenseUsage() {
        this.provider_services.getLicenseUsage()
            .subscribe(
                data => {
                   this.use_metric = data;
                   this.usage_metric = this.use_metric.metricUsageInfo;
                   this.adon_info = this.usage_metric.filter(sch => sch.metricName === 'QBoards');
                   this.adon_total = this.adon_info[0].total;
                   this.adon_used = this.adon_info[0].used;
                   this.disply_name = this.adon_info[0].metricName;
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
}
