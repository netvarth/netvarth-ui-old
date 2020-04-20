import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
    selector: 'app-appointmentmanager',
    templateUrl: './appointmentmanager.component.html'
})
export class AppointmentmanagerComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Appointment Manager'
        }
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    isCorp = false;
    isMultilevel = false;
    accountType: any;
    cust_domain_name = '';
    provider_domain_name = '';
    customer_label = '';
    provider_label = '';
    createappointment_status: any;
    createappointment_statusstr: string;

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.getDomainSubdomainSettings();
        this.getOnlinePresence();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]',this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]',this.provider_label);
    }
    gotoschedules() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'schedules']);
    }
    gotoservices(){
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'services']);
    }
    gotodisplayboards(){
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
    }
    // gotoAppointments(){
    //     this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointment']);
    // }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager->' + mod]);
    }
    getDomainSubdomainSettings() {
        const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isCorp = data.isCorp;
                        this.isMultilevel = data.isMultilevel;
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    handle_appointmentPresence(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setAppointmentPresence(is_check)
          .subscribe(
            () => {
              this.shared_functions.openSnackBar('Appointment creation ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
              this.getOnlinePresence();
            },
            error => {
              this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              this.getOnlinePresence();
            }
          );
      }
      getOnlinePresence() {
        this.provider_services.getGlobalSettings().subscribe(
          (data: any) => {
            this.createappointment_status = data.appointment;
            this.createappointment_statusstr = (this.createappointment_status) ? 'On' : 'Off';
          });
      }
}
