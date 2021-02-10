import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from '../../../../../../../../src/app/shared/constants/project-messages';
import { ProviderServices } from '../../../../../../../../src/app/ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
@Component({
    selector: 'app-edit-store-details',
    templateUrl: './edit-store-details.component.html'
})
export class EditStoreDetailsComponent implements OnInit {
    api_loading = true;
    data: any;
    firstName;
    lastName;
    phone;
    email;
    api_error = null;
    api_success = null;
    address;
    disableButton = false;
    updateInfo: any;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Update';
    alternatePhone: any;
    alternateEmail;
    whatsappNo: any;
    constructor(
        public activateroute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private provider_services: ProviderServices,
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.data = this.router.getCurrentNavigation().extras.state.contact_info;
                this.api_loading = false;
            }
        });
    }
    ngOnInit() {
        console.log(this.email);
        console.log(this.alternateEmail);
        console.log(this.data);
        if (this.data) {
            this.firstName = this.data.firstName;
            this.lastName = this.data.lastName;
            this.phone = this.data.phone;
            this.email = this.data.email;
            this.address = this.data.address;
            this.alternatePhone = this.data.alternatePhone;
            this.alternateEmail = this.data.alternateEmail;
            this.whatsappNo = this.data.whatsappNo;
        }
    }

    onSubmit() {
        console.log('submit');
        const data = {
            'firstName': this.firstName,
            'lastName': this.lastName,
            'phone': this.phone,
            'email': this.email,
            'address': this.address,
            'alternatePhone': this.alternatePhone,
            'alternateEmail': this.alternateEmail,
            'whatsappNo': this.whatsappNo,
            'primCountryCode': '+91',
            'secCountryCode': '+91',
            'whatsAppCountryCode': '+91',
        };
        if ((this.email !== '' && this.email !== undefined) && (this.alternateEmail !== '' && this.alternateEmail !== undefined) && (this.email === this.alternateEmail)) {
            //if (this.email === this.alternateEmail) {
            this.snackbarService.openSnackBar('Email and Alternate email are same. Please enter different email', { 'panelClass': 'snackbarerror' });
           // }
        } else if (this.phone === this.alternatePhone) {
            this.snackbarService.openSnackBar('Phone number and Alternate phone number are same. Please enter different Phone number', { 'panelClass': 'snackbarerror' });
        } else {
            this.editInfo(data);
        }

    }
    editInfo(data) {
        console.log(data);
        this.resetApiErrors();
        this.api_loading = true;
        this.provider_services.editContactInfo(data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CONTACT_INFO_UPDATED'));
                    this.api_loading = false;
                    this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    Back() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
    }

}
