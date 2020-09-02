import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { Location } from '@angular/common';



@Component({
    selector: 'app-teleservice',
    templateUrl: './teleservice.component.html',
    styleUrls: ['./teleservice.component.css']
})
export class TeleServiceComponent implements OnInit {
    customer_label: any;
    provider_label: any;
    ynwUser: any;
    waiting_id: any;
    waiting_type: any;
    notSupported: any;
    availableMsg: any;
    ph_or_tab_cap: any;
    installed_cap: any;
    is_android: boolean;
    is_ios: boolean;
    is_web = false;
    data;
    callingModes: any;
    busnes_name: any;
    serv_name: any;
    servDetails: any;
    emailPresent: boolean;
    consumer_fname: any;
    phNo: any;
    api_loading = false;
    step = 1;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions,
        private _location: Location,
        private router: Router
    ) {
        this.activateroute.queryParams.subscribe(params => {
            this.waiting_id = params.waiting_id;
            this.waiting_type = params.type;
        });
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.ynwUser = this.shared_functions.getitemFromGroupStorage('ynw-user');
        if (this.waiting_type === 'checkin') {
            this.getProviderWaitlstById();
        } else {
            this.getProviderApptById();
        }
        this.notSupported = this.shared_functions.getProjectMesssages('TELE_NOT_SUPPORTED');
        this.availableMsg = this.shared_functions.getProjectMesssages('IS_AVAILABLE');
        this.ph_or_tab_cap = this.shared_functions.getProjectMesssages('PHONE_OR_TAB');
        this.installed_cap = this.shared_functions.getProjectMesssages('IS_INSTALD');
        const isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        if (isMobile.Android()) {
            this.is_android = true;
        } else if (isMobile.iOS()) {
            this.is_ios = true;
        } else {
            this.is_web = true;
        }
    }


    getProviderWaitlstById() {
        this.provider_services.getProviderWaitlistDetailById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.busnes_name = this.data.providerAccount.businessName;
                    this.serv_name = this.data.service.name;
                    this.servDetails = this.data.service;
                    if (this.data.waitlistingFor[0].email) {
                        this.emailPresent = true;
                    }
                    //   this.getMeetingDetails();
                    if (this.waiting_type === 'checkin') {
                        this.consumer_fname = this.data.waitlistingFor[0].firstName;
                        this.consumer_fname = this.data.waitlistingFor[0].lastName;
                        if (this.data.waitlistingFor[0].phoneNo) {
                            this.phNo = this.data.waitlistingFor[0].phoneNo;
                        }
                    }
                });
    }
    getProviderApptById() {
        this.provider_services.getAppointmentById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.busnes_name = this.data.providerAccount.businessName;
                    this.serv_name = this.data.service.name;
                    this.servDetails = this.data.service;
                    if (this.data.providerConsumer.email) {
                        this.emailPresent = true;
                    }
                    //  this.getMeetingDetails();
                    this.consumer_fname = this.data.appmtFor[0].userName;
                });
    }
    redirecToPreviousPage() {
        if (this.step === 1) {
            this._location.back();
        }
    }
}
