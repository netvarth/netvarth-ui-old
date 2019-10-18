import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';


@Component({
    selector: 'app-jdn',
    templateUrl: './jdn.component.html'
})
export class JDNComponent implements OnInit {
    jdn_full_cap = Messages.JDN_FUL_CAP;
    jdn_status ;
    status = 'Create';
    jdn_data;
    domain;
    jdn;
    jdnType;
    jdnlabeltext;
    jdndisplayNote;
    jdnmaxDiscounttext;
    discType;
    rewrite;
    api_error = null;
    api_success = null;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Billing/POS',
            url: '/provider/settings/pos'
        },
        {
            title: 'JDN'
        }
    ];
    constructor(
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {

    }
    ngOnInit() {
        const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
        const sub_domain = user_data.subSector || null;
        this.shared_services.getFeatures(sub_domain)
            .subscribe(data => {
                this.jdn = data;
                this.jdnType = this.jdn.features.JDN.JDNType;
            });
        this.getJdn();
    }

    fillJdnfields(data) {
        this.jdndisplayNote = data.displyNote;
        this.jdnlabeltext = data.label;
        this.discType = data.discPercentage;
        this.jdnmaxDiscounttext = data.discMax;
    }

    save() {
        this.resetApiErrors();
        let post_data;
        if (this.jdnType === 'Label') {
            post_data = {

                "label": this.jdnlabeltext,
                "displyNote": this.jdndisplayNote,
                "status": "ENABLED"

            };
        } else {
            const discountPer = +this.discType;

            post_data = {
                "displyNote": this.jdndisplayNote,
                "discPercentage": discountPer,
                "discMax": this.jdnmaxDiscounttext,
                "status": "ENABLED"
            };
        }

        this.shared_services.addJdn(post_data)
            .subscribe(
                (data) => {
                    this.jdn_status = true;
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_CREATED'), { 'panelClass': 'snackbarerror' });
                    
                    this.getJdn();

                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                }
            );

    }
    update(stat) {
        this.resetApiErrors();
        let put_data;
        if (this.jdnType === 'Label') {
            put_data = {

                "label": this.jdnlabeltext,
                "displyNote": this.jdndisplayNote,
                "status": "ENABLED"

            };
        } else {
            const discountPer = +this.discType;

            put_data = {
                "displyNote": this.jdndisplayNote,
                "discPercentage": discountPer,
                "discMax": this.jdnmaxDiscounttext,
                "status": "ENABLED"
            };
        }
        this.shared_services.updateJdn(put_data)
            .subscribe(
                (data) => {
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_UPDATED'), { 'panelClass': 'snackbarerror' });
                    this.getJdn();
                    this.rewrite =stat;
                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                }
            );


    }
    disable() {
        this.resetApiErrors();
        this.shared_services.disable()
            .subscribe(
                (data) => {
                   this.jdn_status = false;
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_DISABLED'), { 'panelClass': 'snackbarerror' });
                    this.getJdn();
                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getJdn();
                }
            );

    }
    edit(stat){
        this.rewrite =stat;
        this.getJdn();
        }
        cancel(stat){
            this.rewrite =stat;
            this.getJdn();
        }
        handlejdn_status(event){
            const value = (event.checked) ? true : false;
            if(value == true){
                this.save();
            }else{
                this.disable();
            }
        }

    getJdn() {
        this.shared_services.getJdn()
            .subscribe(data => {
                this.jdn_data = data;
                console.log(data);
                if (this.jdn_data != null) {
                    this.status = this.jdn_data.status;
                    if(this.status === 'ENABLED'){
                        this.jdn_status = true;
                    }else{
                        this.jdn_status = false;
                    }
                    // this.jdn_status = (this.status === 'ENABLED') ? 'true' : 'false';
                    this.fillJdnfields(this.jdn_data);
                }
            });
    }
    
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
}
