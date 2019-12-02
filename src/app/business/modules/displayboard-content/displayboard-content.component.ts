import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef, Query } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-content',
    templateUrl: './displayboard-content.component.html'
})
export class DisplayboardLayoutContentComponent implements OnInit {
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
    @ViewChildren('boardid') private boardstyle;
    constructor(private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
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
        this.boardHeight = (screenHeight - 150) / 2;
    }
    ngOnInit() {
        this.getBusinessdetFromLocalstorage();
        if (this.layout_id) {
            let layoutData;
            this.provider_services.getDisplayboard(this.layout_id).subscribe(
                layoutInfo => {
                    layoutData = layoutInfo;
                    const layoutPosition = layoutData.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.boardCols = layoutPosition[1];
                    layoutData.metric.forEach(element => {
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(element);
                    });
                });
        }
    }

    getBusinessdetFromLocalstorage() {
        const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
        if (bdetails) {
          this.bname = bdetails.bn || '';
          this.blogo = bdetails.logo || '';
        }
      }

    getFieldValue(field, checkin) {
        let fieldValue = '';
        if (field.name === 'waitlistingFor') {
            fieldValue = checkin[field.name][0].firstName + ' ' + checkin[field.name][0].lastName;
        } else if (field.name === 'appxWaitingTime') {
            return this.shared_functions.providerConvertMinutesToHourMinute(checkin[field.name]);
        } else if (field.name === 'service' || field.name === 'queue') {
            fieldValue = checkin[field.name].name;
        } else if (field.label === true) {
            if (checkin.label[field.name]) {
                fieldValue = checkin.label[field.name];
            } else {
                fieldValue = field.defaultValue;
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
                this.provider_services.getTodayWaitlist(Mfilter).subscribe(
                    (waitlist) => {
                        this.selectedDisplayboards[element.position]['checkins'] = waitlist;
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
        layout.statusBoardFor.forEach(element => {
            if (element.type === 'SERVICE') {
                api_filter['service-eq'] = element.id[0];
            } else if (element.type === 'QUEUE') {
                api_filter['queue-eq'] = element.id[0];
            } else {
                api_filter['department-eq'] = element.id[0];
            }
        });
        return api_filter;
    }
}


