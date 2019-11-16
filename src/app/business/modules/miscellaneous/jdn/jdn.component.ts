import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';


@Component({
    selector: 'app-jdn',
    templateUrl: './jdn.component.html'
})
export class JDNComponent implements OnInit {
    jdn_full_cap = Messages.JDN_FUL_CAP;
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
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous'
        },
        {
            title: 'JDN'
        }
    ];
    jdnPercentage: any;
    maximumDiscount1: any;
    maximumDiscount2: any;
    maximumDiscount3: any;
    rupee_symbol = '₹';
    breadcrumb_moreoptions: any = [];
    btn_msg = '';
    constructor(
        private shared_services: SharedServices,
        private routerobj: Router,
        private shared_functions: SharedFunctions,
        private dialog: MatDialog) {
    }
    ngOnInit() {
        const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user_data.sector;
        const sub_domain = user_data.subSector || null;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.shared_services.getFeatures(sub_domain)
            .subscribe(data => {
                this.jdn = data;
                if (this.jdn && this.jdn.features.JDN) {
                    this.jdnType = this.jdn.features.JDN.JDNType;
                    this.jdnPercentage = this.jdn.features.JDN.JDNPercent;
                    if (this.jdnPercentage) {
                        for (const option of this.jdnPercentage) {
                            if (option.percentage === 5) {
                                this.maximumDiscount1 = option.maxDiscount;
                            } else if (option.percentage === 10) {
                                this.maximumDiscount2 = option.maxDiscount;
                            } else {
                                this.maximumDiscount3 = option.maxDiscount;
                            }
                        }
                    }
                }
            });
        this.getJdnDetails();
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->jdn']);
        }
    }

    fillJdnfields(data) {
        this.jdndisplayNote = data.displayNote;
        this.jdnlabeltext = data.label;
        this.discType = data.discPercentage;
        this.jdnmaxDiscounttext = data.discMax;
    }

    saveJDN() {
        this.resetApiErrors();
        let post_data;
        if (this.jdnType === 'Label') {
            post_data = {
                'label': this.jdnlabeltext,
                'displayNote': this.jdndisplayNote || '',
                'status': 'ENABLED'
            };
        } else {
            const discountPer = +this.discType;
            post_data = {
                'displayNote': this.jdndisplayNote || '',
                'discPercentage': discountPer,
                'discMax': this.jdnmaxDiscounttext,
                'status': 'ENABLED'
            };
        }
        this.shared_services.addJdn(post_data)
            .subscribe(
                (data) => {
                    this.btn_msg = Messages.UNSUBSCRIBE;
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_CREATED'), { 'panelclass': 'snackbarerror' });
                    this.getJdnDetails();
                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }

    radioChange(event) {
        if (event.value === 5) {
            this.jdnmaxDiscounttext = this.maximumDiscount1;
        } else if (event.value === 10) {
            this.jdnmaxDiscounttext = this.maximumDiscount2;
        } else {
            this.jdnmaxDiscounttext = this.maximumDiscount3;
        }
    }
    update(stat) {
        this.resetApiErrors();
        let put_data;
        if (this.jdnType === 'Label') {
            put_data = {
                'label': this.jdnlabeltext,
                'displayNote': this.jdndisplayNote || '',
                'status': 'ENABLED'
            };
        } else {
            const discountPer = +this.discType;
            put_data = {
                'displayNote': this.jdndisplayNote || '',
                'discPercentage': discountPer,
                'discMax': this.jdnmaxDiscounttext,
                'status': 'ENABLED'
            };
        }
        this.shared_services.updateJdn(put_data)
            .subscribe(
                (data) => {
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_UPDATED'), { 'panelclass': 'snackbarerror' });
                    this.getJdnDetails();
                    this.rewrite = stat;
                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    disableJDN() {
        this.resetApiErrors();
        this.shared_services.disable()
            .subscribe(
                (data) => {
                    this.btn_msg = Messages.SUBSCRIBE;
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('JDN_DISABLED'), { 'panelclass': 'snackbarerror' });
                    this.getJdnDetails();
                },
                error => {
                    this.api_error = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getJdnDetails();
                }
            );
    }
    edit(stat) {
        this.rewrite = stat;
        this.getJdnDetails();
    }
    cancel(stat) {
        this.rewrite = stat;
        this.getJdnDetails();
    }
    handlejdn_status(status) {
        let confirm_msg = '';
        if (status === 'DISABLED') {
            confirm_msg = 'You are joining JDN (Jaldee Discount Network) lifetime membership of ₹ 499. Please visit learnmore for more info';
        } else {
            confirm_msg = 'Are you sure to unsubscribe your JDN lifetime membership? If you wish to resubscribe you have to pay again';
        }
        const confirmdialog = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': confirm_msg,
                'heading': 'Confirm'
            }
        });
        confirmdialog.afterClosed().subscribe(result => {
            if (result) {
                if (status === 'DISABLED') {
                    this.saveJDN();
                } else {
                    this.disableJDN();
                }
            }
        });
    }

    getJdnDetails() {
        this.shared_services.getJdn()
            .subscribe(data => {
                this.jdn_data = data;
                if (this.jdn_data != null) {
                    this.status = this.jdn_data.status;
                    if (this.status === 'ENABLED') {
                        this.btn_msg = Messages.UNSUBSCRIBE;
                    } else {
                        this.btn_msg = Messages.SUBSCRIBE;
                    }
                    this.fillJdnfields(this.jdn_data);
                }
            });
    }

    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
}

