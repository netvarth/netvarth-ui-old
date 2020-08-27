import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';

@Component({
    'selector': 'app-item-details',
    'templateUrl': './item-details.component.html'
})
export class ItemDetailsComponent implements OnInit {
    item_id;
    rupee_symbol = '₹';
    item_hi_cap = Messages.ITEM_HI_CAP;
    item_name_cap = Messages.ITEM_NAME_CAP;
    short_desc_cap = Messages.SHORT_DESC_CAP;
    detailed_dec_cap = Messages.DETAIL_DESC_CAP;
    price_cap = Messages.PRICES_CAP;
    taxable_cap = Messages.TAXABLE_CAP;
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    item_status = projectConstants.ITEM_STATUS;
    detail_desc_cap = Messages.DETAIL_DESC_CAP;
    status_cap = Messages.COUPONS_STATUS_CAP;
    item_detail_cap = Messages.ITEM_DETAIL_CAP;
    amForm: FormGroup;
    api_error = null;
    api_success = null;
    parent_id;
    selitem_pic = '';
    char_count = 0;
    max_char_count = 500;
    isfocused = false;
    item_pic = {
        files: [],
        base64: null
    };
    taxpercentage = 0;
    price = 0;
    holdtaxable = false;
    file_error_msg = '';
    img_exists = false;
    maxChars = projectConstantsLocal.VALIDATOR_MAX50;
    maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
    maxNumbers = projectConstantsLocal.VALIDATOR_MAX6;
    max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
    api_loading = true;
    disableButton = false;

    // @ViewChild('caption', { static: false }) private captionRef: ElementRef;
    customer_label;
    action;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Jaldee Billing',
            url: '/provider/settings/pos'
        },
        {
            title: 'Items',
            url: '/provider/settings/pos/items'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    image_list: any = [];
    item;
    taxDetails: any = [];
    itemname: any;
    Addcaption = 'Add Item';
    constructor(private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService) {
        this.activated_route.params.subscribe(
            (params) => {
                this.item_id = params.id;
                this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
                if (this.item_id) {
                    if (this.item_id === 'add') {
                        const breadcrumbs = [];
                        this.breadcrumbs_init.map((e) => {
                            breadcrumbs.push(e);
                        });
                        breadcrumbs.push({
                            title: 'Add'
                        });
                        this.breadcrumbs = breadcrumbs;
                        this.action = 'add';
                        this.createForm();
                    } else {
                        this.activated_route.queryParams.subscribe(
                            (qParams) => {
                                this.action = qParams.action;
                                this.getItem(this.item_id).then(
                                    (item) => {
                                        this.item = item;
                                        this.itemname = this.item.displayName;
                                        if (this.action === 'edit') {
                                            const breadcrumbs = [];
                                            this.breadcrumbs_init.map((e) => {
                                                breadcrumbs.push(e);
                                            });
                                            breadcrumbs.push({
                                                title: this.itemname
                                            });
                                            this.breadcrumbs = breadcrumbs;
                                            this.createForm();
                                        } else if (this.action === 'view') {
                                            const breadcrumbs = [];
                                            this.breadcrumbs_init.map((e) => {
                                                breadcrumbs.push(e);
                                            });
                                            breadcrumbs.push({
                                                title: this.itemname
                                            });
                                            this.breadcrumbs = breadcrumbs;
                                        }
                                    }
                                );
                            }
                        );
                    }
                    this.api_loading = false;
                }
            }
        );
    }
    ngOnInit() {
        this.getTaxpercentage();
    }
    getItem(itemId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderItems(itemId)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    goBack() {
        this.router.navigate(['provider', 'settings', 'pos',
            'items']);
        this.api_loading = false;
    }
    createForm() {
        if (this.action === 'add') {
            this.amForm = this.fb.group({
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDesc: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                taxable: [false, Validators.compose([Validators.required])],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
            });
        } else {
            this.amForm = this.fb.group({
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDesc: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                taxable: [false, Validators.compose([Validators.required])],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
            });
        }
        if (this.action === 'edit') {
            this.Addcaption = 'Edit Item';
            this.updateForm();
        }
    }
    setDescFocus() {
        this.isfocused = true;
        this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
    }
    updateForm() {
        if (this.item.taxable === true) {
            // taxable = '1';
            this.holdtaxable = true;
        }
        this.amForm.setValue({
            'displayName': this.item.displayName || null,
            'shortDesc': this.item.shortDesc || null,
            'displayDesc': this.item.displayDesc || null,
            'price': this.item.price || null,
            'taxable': this.holdtaxable
        });
    }
    handleTaxablechange() {
        this.resetApiErrors();
        if (this.taxpercentage <= 0) {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
            setTimeout(() => {
                this.api_error = null;
            }, projectConstants.TIMEOUT_DELAY_LARGE);
            this.amForm.get('taxable').setValue(false);
        } else {
            this.api_error = null;
        }
    }
    showimg() {
        if (this.item_pic.base64) {
            return this.item_pic.base64;
        } else {
            return this.sharedfunctionObj.showitemimg('');
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'pos',
            'items']);
        this.api_loading = false;
    }
    onSubmit(form_data) {
        const iprice = parseFloat(form_data.price);
        if (!iprice || iprice === 0) {
            this.api_error = 'Please enter valid price';
            return;
        }
        if (iprice < 0) {
            this.api_error = 'Price should not be a negative value';
            return;
        }
        if (this.action === 'add') {
            const post_itemdata = {
                'displayName': form_data.displayName,
                'shortDesc': form_data.shortDesc,
                'displayDesc': form_data.displayDesc,
                'taxable': form_data.taxable,
                'price': form_data.price
            };
            this.addItem(post_itemdata);
        } else if (this.action === 'edit') {
            const post_itemdata = {
                'displayName': form_data.displayName,
                'shortDesc': form_data.shortDesc,
                'displayDesc': form_data.displayDesc,
                'taxable': form_data.taxable,
                'price': form_data.price
            };
            this.editItem(post_itemdata);
        }
    }
    addItem(post_data) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        this.provider_services.addItem(post_data)
            .subscribe(
                () => {
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED'));
                    this.api_loading = false;
                    this.router.navigate(['provider', 'settings', 'pos', 'items']);
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    editItem(post_itemdata) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        post_itemdata.itemId = this.item.itemId;
        this.provider_services.editItem(post_itemdata)
            .subscribe(
                () => {
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_UPDATED'));
                    this.api_loading = false;
                    this.router.navigate(['provider', 'settings', 'pos', 'items']);
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    isNumeric(evt) {
        return this.sharedfunctionObj.isNumeric(evt);
    }
    isvalid(evt) {
        return this.sharedfunctionObj.isValid(evt);
    }
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe(data => {
                if (data) {
                    this.taxDetails = data;
                    this.taxpercentage = this.taxDetails.taxPercentage;
                }
            });
        this.api_loading = false;
    }
    editViewedItem(item) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'pos', 'items', item.itemId], navigationExtras);
    }
    redirecToJaldeeBilling() {
        this.router.navigate(['provider', 'settings', 'pos' , 'items']);
    }
}
