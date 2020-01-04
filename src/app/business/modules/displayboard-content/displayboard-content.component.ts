import { Component, OnInit, HostListener, ViewChildren, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Subscription, Observable } from 'rxjs';
import { SharedServices } from '../../../shared/services/shared-services';

@Component({
    selector: 'app-displayboard-content',
    templateUrl: './displayboard-content.component.html'
})
export class DisplayboardLayoutContentComponent implements OnInit, OnDestroy {
    layout_id;
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    boardRows: any;
    boardCols: any;
    selectedDisplayboards: any = {};
    boardHeight;
    bname;
    blogo;
    metricElement;
    cronHandle: Subscription;
    @ViewChildren('boardid') private boardstyle;
    MainBlogo;
    bProfile: any = [];
    qualification: any = [];
    subDomVirtualFields: any = [];
    accountType;
    MainBname;
    locId;
    provider_id;
    businessJson: any = [];

    StatusboardJson = [{
        'id': 131,
        'name': 'dfhd',
        'displayName': 'dfhd',
        'layout': '1_1',
        'metric': [
            {
                'providerId': 72407,
                'sbId': {
                    'id': 196,
                    'name': 'Appt Criteria',
                    'displayName': 'Appt Criteria',
                    'fieldList': [{
                        'name': 'waitlistingFor',
                        'label': false,
                        'order': 2,
                        'displayName': 'Customer',
                        'defaultValue': ''
                    }, {
                        'name': 'primaryMobileNo',
                        'label': false,
                        'order': 3,
                        'displayName': 'Mobile',
                        'defaultValue': ''
                    }, {
                        'name': 'appointmentTime',
                        'label': false,
                        'order': 4,
                        'displayName': 'Appointment Time',
                        'defaultValue': ''
                    }, {
                        'name': 'service',
                        'label': false,
                        'order': 6,
                        'displayName': 'Service',
                        'defaultValue': ''
                    }, {
                        'name': 'queue',
                        'label': false,
                        'order': 7,
                        'displayName': 'Queue',
                        'defaultValue': ''
                    }],
                    'queueSetFor': [{
                        'id': [4783],
                        'type': 'QUEUE'
                    }],
                    'sortBy': {
                        'sort_appointmentTime': 'asc'
                    }
                },
                'position': '0_0'
            },
            {
                'providerId': 72404,
                'sbId': {
                    'id': 198,
                    'name': 'Token',
                    'displayName': 'Token',
                    'fieldList': [{
                        'name': 'token',
                        'label': false,
                        'order': 1,
                        'displayName': 'Token',
                        'defaultValue': ''
                    }, {
                        'name': 'waitlistingFor',
                        'label': false,
                        'order': 2,
                        'displayName': 'Customer',
                        'defaultValue': ''
                    }, {
                        'name': 'primaryMobileNo',
                        'label': false,
                        'order': 3,
                        'displayName': 'Mobile',
                        'defaultValue': ''
                    }, {
                        'name': 'queue',
                        'label': false,
                        'order': 7,
                        'displayName': 'Queue',
                        'defaultValue': ''
                    }],
                    'queueSetFor': [{
                        'id': [4784],
                        'type': 'QUEUE'
                    }],
                    'sortBy': {
                        'sort_token': 'asc'
                    }
                },
                'position': '0_0'
            }]
    }];

    constructor(private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {
        this.onResize();
        this.activated_route.params.subscribe(
            qparams => {
                this.layout_id = qparams.id;
            });
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        const screenHeight = window.innerHeight;
        let hgt_reduced = 150;
        if (this.accountType === 'BRANCH_SP') {
            hgt_reduced = 270;
        }
        if (this.boardRows > 1) {
            this.boardHeight = (screenHeight - hgt_reduced) / 2;
        } else {
            this.boardHeight = (screenHeight - hgt_reduced);
        }
    }
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
    }
    ngOnInit() {
        this.getBusinessProfile();
        this.getBusinessdetFromLocalstorage();
        this.getStatusboard();
        console.log(this.StatusboardJson);
        this.cronHandle = Observable.interval(30000).subscribe(() => {
            this.getStatusboard();
        });
    }

    getStatusboard() {
        const loc_details = this.shared_functions.getitemFromGroupStorage('loc_id');
        this.locId = loc_details.id;
        if (this.layout_id) {
            let layoutData;
            this.provider_services.getDisplayboard(this.layout_id).subscribe(
                layoutInfo => {
                    layoutData = layoutInfo;
                    const layoutPosition = layoutData.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.onResize();
                    this.boardCols = layoutPosition[1];
                    layoutData.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                });
        }
    }
    getBusinessdetFromLocalstorage() {
        const MainBdetails = this.shared_functions.getitemFromGroupStorage('ynwbp', 'branch');
        const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
        if (bdetails) {
            this.bname = bdetails.bn || '';
            this.blogo = bdetails.logo || '';
        }
        if (MainBdetails) {
            this.MainBname = MainBdetails.bn || '';
            this.MainBlogo = MainBdetails.logo || '';
        }
    }

    getFieldValue(field, checkin) {
        let fieldValue = '';
        if (field.name === 'waitlistingFor') {
            const lastName = checkin[field.name][0].lastName;
            const nameLength = lastName.length;
            const encryptedName = [];
            let lastname = '';
            for (let i = 0; i < nameLength; i++) {
                encryptedName[i] = lastName[i].replace(/./g, '*');
            }
            for (let i = 0; i < nameLength; i++) {
                lastname += encryptedName[i];

            }
            fieldValue = checkin[field.name][0].firstName + ' ' + lastname;
        } else if (field.name === 'appxWaitingTime') {
            return this.shared_functions.providerConvertMinutesToHourMinute(checkin[field.name]);
        } else if (field.name === 'service') {
            fieldValue = checkin[field.name].name;
        } else if (field.name === 'queue') {
            fieldValue = checkin[field.name].queueStartTime + ' - ' + checkin[field.name].queueEndTime;
        } else if (field.label === true) {
            if (checkin.label[field.name]) {
                fieldValue = checkin.label[field.name];
            } else {
                fieldValue = field.defaultValue;
            }
        } else if (field.name === 'primaryMobileNo') {
            const full_phone = checkin['waitlistingFor'][0]['primaryMobileNo'];
            const phLength = full_phone.length;
            const tele = [];
            for (let i = 0; i < phLength; i++) {
                if (i < 6) {
                    tele[i] = full_phone[i].replace(/^\d+$/, '*');
                } else {
                    tele[i] = full_phone[i];
                }
            }
            for (let i = 0; i < phLength; i++) {
                fieldValue += tele[i];
            }
        } else {
            fieldValue = checkin[field.name];
        }
        return fieldValue;
    }
    setDisplayboards(element) {
        this.provider_services.getDisplayboardQSetbyId(element.sbId).subscribe(
            (displayboard) => {
                this.selectedDisplayboards[element.position]['board'] = displayboard;
                const Mfilter = this.setFilterForApi(displayboard);
                Object.keys(displayboard['sortBy']).forEach(key => {
                    Mfilter[key] = displayboard['sortBy'][key];
                });
                this.provider_services.getTodayWaitlist(Mfilter).subscribe(
                    (waitlist) => {
                        const wtlst = this.shared_functions.sortByMapkey(waitlist, 'label', 'lblTime');
                        this.selectedDisplayboards[element.position]['checkins'] = wtlst;
                    });
            });
    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
    setFilterForApi(layout) {
        const api_filter = {};
        api_filter['location-eq'] = this.locId;
        layout.queueSetFor.forEach(element => {
            if (element.type === 'SERVICE') {
                api_filter['service-eq'] = element.id[0];
            } else if (element.type === 'QUEUE') {
                api_filter['queue-eq'] = element.id[0];
            } else {
                api_filter['department-eq'] = element.id[0];
            }
            api_filter['waitlistStatus-eq'] = 'arrived,checkedIn,started';
        });
        return api_filter;
    }
    gets3curl() {
        this.shared_functions.getS3Url('provider')
            .then(
                res => {
                    this.getbusinessprofiledetails_json(res, 'businessProfile', true);
                }
            );
    }
    getbusinessprofiledetails_json(url, section, modDateReq: boolean) {
        let UTCstring = null;
        if (modDateReq) {
            UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
        }
        this.shared_services.getbusinessprofiledetails_json(this.provider_id, url, section, UTCstring)
            .subscribe(res => {
                this.businessJson = res;
            });
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bProfile = data;
                    if (this.bProfile && this.bProfile.subDomainVirtualFields) {
                        this.getQualification(this.bProfile.subDomainVirtualFields[0]);
                    }
                    this.provider_id = this.bProfile.uniqueId;
                    this.gets3curl();
                });
    }

    getQualification(list) {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        const virtualfields = list[user.subSector];
        this.provider_services.getVirtualFields(user.sector, user.subSector).subscribe(data => {
            this.subDomVirtualFields = data;
            for (let i = 0; i < this.subDomVirtualFields.length; i++) {
                if (this.subDomVirtualFields[i].baseField === 'qualification') {
                    const eduName = this.subDomVirtualFields[i]['name'];
                    this.qualification = virtualfields[eduName];
                }
            }
        });
    }
}
