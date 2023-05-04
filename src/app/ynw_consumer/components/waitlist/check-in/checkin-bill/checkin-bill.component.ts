import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';
// import { WindowRefService } from '../../../../../shared/services/windowRef.service';
import { RazorpayService } from '../../../../../shared/services/razorpay.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { S3UrlProcessor } from '../../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../../node_modules/subsink';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';
import { PaytmService } from '../../../../../../app/shared/services/paytm.service';
import { LocalStorageService } from '../../../../../../app/shared/services/local-storage.service';
import { CheckInHistoryServices } from '../../../../../shared/modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.service';
import { JcCouponNoteComponent } from '../../../../../shared/modules/jc-coupon-note/jc-coupon-note.component';


@Component({
    selector: 'app-consumer-checkin-bill',
    templateUrl: './checkin-bill.component.html',
    styleUrls: ['./checkin-bill.component.css']
})
export class ConsumerCheckinBillComponent implements OnInit, OnDestroy {
    @ViewChild('itemservicesearch') item_service_search;
    tooltipcls = '';
    new_cap = Messages.NEW_CAP;
    bill_cap = Messages.BILL_CAPTION;
    date_cap = Messages.DATE_CAP;
    time_cap = Messages.TIME_CAP;
    bill_no_cap = Messages.BILL_NO_CAP;
    gstin_cap = Messages.GSTIN_CAP;
    ad_ser_item_cap = Messages.ADD_SER_ITEM_CAP;
    no_cap = Messages.NO_CAP;
    available_cap = Messages.AVAILABLE_CAP;
    qty_cap = Messages.QTY_CAPITAL_CAP;
    add_btn_cap = Messages.ADD_BTN;
    cancel_btn_cap = Messages.CANCEL_BTN;
    qnty_cap = Messages.QTY_CAP;
    select_discount_cap = Messages.SEL_DISC_CAP;
    select_coupon_cap = Messages.SEL_COUPON_CAP;
    done_btn_cap = Messages.DONE_BTN;
    discount_cap = Messages.DISCOUNT_CAP;
    coupon_cap = Messages.COUPON_CAP;
    sub_tot_cap = Messages.SUB_TOT_CAP;
    dis_coupons_cap = Messages.DISCOUNTS_COUPONS_CAP;
    delete_btn_cap = Messages.DELETE_BTN;
    gross_amnt_cap = Messages.GROSS_AMNT_CAP;
    bill_disc_cap = Messages.BILL_DISCOUNT_CAP;
    tax_cap = Messages.TAX_CAP;
    amount_paid_cap = Messages.AMNT_PAID_CAP;
    amount_to_pay_cap = Messages.AMNT_TO_PAY_CAP;
    back_to_bill_cap = Messages.BACK_TO_BILL_CAP;
    payment_logs_cap = Messages.PAY_LOGS_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    refundable_cap = Messages.REFUNDABLE_CAP;
    status_cap = Messages.PAY_STATUS;
    mode_cap = Messages.MODE_CAP;
    refunds_cap = Messages.REFUNDS_CAP;
    coupon_notes = projectConstantsLocal.COUPON_NOTES;
    api_error = null;
    api_success = null;
    checkin = null;
    bill_data = null;
    message = '';
    items: any = [];
    pre_payment_log: any = [];
    payment_options: any = [];
    close_msg = 'close';
    bname = '';
    billdate = '';
    billtime = '';
    gstnumber = '';
    billnumber = '';
    bill_load_complete = 0;
    item_service_tax: any = 0;
    uuid;
    gateway_redirection = false;
    payModesExists = false;
    payModesQueried = false;
    pay_data: any = {};
    payment_popup = null;
    showPaidlist = false;
    showJCouponSection = false;
    jCoupon = '';
    couponList: any = {
        JC: [], OWN: []
    };
    refund_value;
    discountDisplayNotes = false;
    billNoteExists = false;
    showBillNotes = false;
    paytmEnabled = false;
    razorpayEnabled = false;
    interNatioanalPaid = false;
    type;
    accountId;
    pid;
    source;
    pGateway: any;
    razorModel: any;
    origin: string;
    paidStatus = 'false';
    checkIn_type: any;
    razorpay_order_id: any;
    razorpay_payment_id: any;
    razorpayDetails: any = [];
    provider_label = '';
    api_loading = true;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
    newDateFormat_date = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    retval;
    terminologiesjson;
    provider_id;
    private subs = new SubSink();
    splocation: any;
    checkJcash = false;
    checkJcredit = false;
    jaldeecash: any;
    jcashamount: any;
    jcreditamount: any;
    remainingadvanceamount;
    wallet: any;
    loadingPaytm = false;
    isClickedOnce = false;
    @ViewChild('consumer_checkinbill') paytmview;
    paymentmodes: any;
    paymode = false;
    customer_countrycode: any;
    isPayment: boolean;
    indian_payment_modes: any = [];
    non_indian_modes: any = [];
    shownonIndianModes: boolean;
    selected_payment_mode: any;
    isInternatonal: boolean;
    customId: any;
    results: any;
    constructor(private consumer_services: ConsumerServices,
        public consumer_checkin_history_service: CheckInHistoryServices,
        public sharedfunctionObj: SharedFunctions,
        public sharedServices: SharedServices,
        public _sanitizer: DomSanitizer,
        private activated_route: ActivatedRoute,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private dialog: MatDialog,
        private locationobj: Location,
        @Inject(DOCUMENT) public document,
        public razorpayService: RazorpayService,
        // public winRef: WindowRefService,
        private cdRef: ChangeDetectorRef,
        private location: Location,
        private s3Processor: S3UrlProcessor,
        public router: Router,
        public dateformat: DateFormatPipe,
        private ngZone: NgZone,
        private paytmService: PaytmService,
        private lStorageService: LocalStorageService,
    ) {
        this.subs.sink = this.activated_route.queryParams.subscribe(
            params => {
                if (params.accountId) {
                    this.accountId = params.accountId;
                }
                if(params.customId) {
                    this.customId =params.customId;
                }
                if (params.paidStatus) {
                    this.paidStatus = params.paidStatus;
                }
                if (params.uuid) {
                    this.uuid = params.uuid;

                }
                if (params.source) {
                    this.source = params.source;
                }
                this.getWaitlist();
                if (this.source === 'history') {
                    this.checkIn_type = 'checkin_historybill';
                }
                if (params.type) {
                    this.checkIn_type = params.type;
                }
                if (params.details) {
                    this.razorpayDetails = JSON.parse(params.details);
                    this.razorpay_order_id = this.razorpayDetails.razorpay_order_id;
                    this.razorpay_payment_id = this.razorpayDetails.razorpay_payment_id;
                    this.cdRef.detectChanges();
                }

            });
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    }

    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        switch (type) {
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                break;
            }
            // case 'coupon': {
            //     this.couponList.JC = result;
            //     break;
            // }
            // case 'providerCoupon': {
            //     this.couponList.OWN = result;
            //     break;
            // }
        }
    }


    gets3curl() {
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id, null, 'terminologies,coupon,providerCoupon').subscribe(
            (accountS3s) => {
                if (accountS3s['terminologies']) {
                    this.processS3s('terminologies', accountS3s['terminologies']);
                }
                if (accountS3s['coupon']) {
                    this.processS3s('coupon', accountS3s['coupon']);
                }
                if (accountS3s['providerCoupon']) {
                    this.processS3s('providerCoupon', accountS3s['providerCoupon']);
                }
            });
    }
    getTerminologyTerm(term) {
        const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
        if (this.terminologiesjson) {
            return this.wordProcessor.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
        } else {
            return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
        }
    }
    getImageSrc(mode) {
        return 'assets/images/payment-modes/' + mode + '.png';
    }
    goBack() {
        this.location.back();
    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    getWaitlist() {
        const params = {
            account: this.accountId
        };
        this.subs.sink = this.consumer_services.getWaitlistDetail(this.uuid, params)
            .subscribe(
                data => {
                    this.checkin = data;
                    this.provider_id = this.checkin.providerAccount.uniqueId;
                    this.gets3curl();
                    this.getWaitlistBill();
                    this.getCoupons();
                    this.getPrePaymentDetails();
                    this.getPaymentModes();
                    const credentials = this.sharedfunctionObj.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
                    this.customer_countrycode = credentials.countryCode;
                });
    }
    getCoupons(){
       
        this.sharedServices.getApptCoupons(this.checkin.serviceData.id,this.checkin.location.id)
            .subscribe(
                (res: any) => {
                  this.results = res; 
                  if(this.results && this.results.jaldeeCoupons){
                    this.couponList.JC = this.results.jaldeeCoupons;
                   
                  }
                  if(this.results && this.results.providerCoupons){
                    this.couponList.OWN = this.results.providerCoupons;
                  }
                
                },
                error => {
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  
                }
            );
    
    }
    getBillDateandTime() {
        if (this.bill_data.hasOwnProperty('createdDate')) {
            this.billdate = this.bill_data.createdDate;
            const datearr = this.bill_data.createdDate.split(' ');
            const billdatearr = datearr[0].split('-');
            this.billtime = datearr[1] + ' ' + datearr[2];
            this.billdate = billdatearr[0] + '-' + billdatearr[1] + '-' + billdatearr[2];
        }
        if (this.bill_data.hasOwnProperty('gstNumber')) {
            this.gstnumber = this.bill_data.gstNumber;
        }
        this.bname = this.checkin.providerAccount['businessName'];
        if (this.bill_data.hasOwnProperty('billId')) {
            this.billnumber = this.bill_data.billId;
        }
    }
    stringtoDate(dt, mod) {
        let dtsarr;
        if (dt) {
            dtsarr = dt.split(' ');
            const dtarr = dtsarr[0].split('-');
            let retval = '';
            if (mod === 'all') {
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
            } else if (mod === 'date') {
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
            }
            return retval;
        } else {
            return;
        }
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    showJCWorkbench() {
        this.showJCouponSection = true;
    }
    getWaitlistBill() {
        const params = {
            account: this.accountId
        };
        this.subs.sink = this.consumer_checkin_history_service.getWaitlistBill(params, this.uuid)
            .subscribe(
                data => {
                    this.bill_data = data;
                    this.api_loading = false;
                    for (let i = 0; i < this.bill_data.discount.length; i++) {
                        if (this.bill_data.discount[i].displayNote) {
                            this.discountDisplayNotes = true;
                        }
                    }
                    if (this.bill_data.displayNotes || this.discountDisplayNotes) {
                        this.billNoteExists = true;
                    }
                    if (this.bill_data.amountDue < 0) {
                        this.refund_value = Math.abs(this.bill_data.amountDue);
                    }
                    if (this.bill_data.amountDue > 0) {
                        this.getJaldeeCashandCredit();
                    }
                    if (this.bill_data.accountProfile.location && this.bill_data.accountProfile.location.place) {
                        this.splocation = this.bill_data.accountProfile.location.place;
                    }

                    this.getBillDateandTime();
                },
                error => {
                },
                () => {
                }
            );
    }
    getJaldeeCashandCredit() {
        this.sharedServices.getJaldeeCashandJcredit()
            .subscribe(data => {
                this.checkJcash = true
                this.jaldeecash = data;
                this.jcashamount = this.jaldeecash.jCashAmt;
                this.jcreditamount = this.jaldeecash.creditAmt;
            });
    }
    billNotesClicked() {
        if (!this.showBillNotes) {
            this.showBillNotes = true;
        } else {
            this.showBillNotes = false;
        }
    }
    billNotesExists(billNotesExists: any) {
        throw new Error('Method not implemented.');
    }
    getPrePaymentDetails() {
        const params = {
            account: this.accountId
        };
        this.subs.sink = this.consumer_checkin_history_service.getPaymentDetail(params, this.uuid)
            .subscribe(
                data => {
                    this.pre_payment_log = data;
                },
                () => {

                }
            );
    }
    /**
     * To Get Payment Modes
     */
    getPaymentModes() {

        this.sharedServices.getPaymentModesofProvider(this.accountId, 0, 'billPayment')
            .subscribe(
                data => {

                    this.paymentmodes = data[0];
                    this.isPayment = true;
                    if (this.paymentmodes && this.paymentmodes.indiaPay) {
                        this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
                    }
                    if (this.paymentmodes && this.paymentmodes.internationalPay) {
                        this.non_indian_modes = this.paymentmodes.internationalBankInfo;

                    }
                    if (this.paymentmodes && !this.paymentmodes.indiaPay && this.paymentmodes.internationalPay) {
                        this.shownonIndianModes = true;
                    } else {
                        this.shownonIndianModes = false;
                    }

                },
                error => {
                    this.isPayment = false;
                    console.log(this.isPayment);
                }
            );
    }
    /**
     * Perform PayU Payment
     */  indian_payment_mode_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = false;
    }
    non_indian_modes_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = true;
    }
    togglepaymentMode() {
        this.shownonIndianModes = !this.shownonIndianModes;
        this.selected_payment_mode = null;
    }
    payuPayment(paymentType?) {
        this.isClickedOnce = true;
        console.log(this.isClickedOnce);
        if (this.jcashamount > 0 && this.checkJcash) {
            this.sharedServices.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.bill_data.amountDue)
                .subscribe(data => {
                    this.remainingadvanceamount = data;
                    if (this.remainingadvanceamount == 0 && this.checkJcash) {
                        const postData = {
                            'amountToPay': this.bill_data.amountDue,
                            'accountId': this.accountId,
                            'uuid': this.uuid,
                            'paymentPurpose': 'billPayment',
                            'isJcashUsed': true,
                            'isreditUsed': false,
                            'paymentMode': 'JCASH',
                            'isInternational': false,
                            'serviceId': 0
                        };
                        this.sharedServices.PayByJaldeewallet(postData)
                            .subscribe(data => {
                                this.loadingPaytm = false;
                                this.wallet = data;
                                if (!this.wallet.isGateWayPaymentNeeded && this.wallet.isJCashPaymentSucess) {
                                    this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                                    this.router.navigate(['consumer']);
                                }
                            },
                                error => {
                                    this.isClickedOnce = false;
                                    this.loadingPaytm = false;
                                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                                });
                    } else if (this.remainingadvanceamount > 0 && this.checkJcash) {

                        if (this.selected_payment_mode && this.selected_payment_mode.toLowerCase() === 'cash') {
                            this.cashPayment();
                        } else {
                            const postData = {
                                'amountToPay': this.bill_data.amountDue,
                                'accountId': this.accountId,
                                'uuid': this.uuid,
                                'paymentPurpose': 'billPayment',
                                'isJcashUsed': true,
                                'isreditUsed': false,
                                'paymentMode': this.selected_payment_mode,
                                'isinternational': this.isInternatonal,
                                'serviceId': 0
                            };

                            this.sharedServices.PayByJaldeewallet(postData)
                                .subscribe((pData: any) => {
                                    this.origin = 'consumer';
                                    console.log(pData)
                                    if (pData.isGateWayPaymentNeeded == true && pData.isJCashPaymentSucess == true) {
                                        if (pData.paymentGateway == 'PAYTM') {
                                            this.payWithPayTM(pData.response, this.accountId);
                                        } else {
                                            this.paywithRazorpay(pData.response);
                                        }
                                    }
                                    // if (pData.isGateWayPaymentNeeded && pData.isJCashPaymentSucess) {
                                    //     if (pData.response.paymentGateway == 'PAYTM') {

                                    //         this.payWithPayTM(pData.response, this.accountId);
                                    //     } else {

                                    //         this.paywithRazorpay(pData.response);
                                    //     }
                                    // }
                                },
                                    error => {
                                        this.isClickedOnce = false;
                                        this.loadingPaytm = false;
                                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                                    });
                        }

                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.loadingPaytm = false;
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
        else {
            console.log("HERE:" + this.selected_payment_mode);
            if (this.selected_payment_mode && this.selected_payment_mode.toLowerCase() === 'cash') {
                this.cashPayment();
            } else {
                this.pay_data.uuid = this.uuid;
                this.pay_data.amount = this.bill_data.amountDue;
                this.pay_data.paymentMode = this.selected_payment_mode;
                this.pay_data.accountId = this.accountId;
                this.pay_data.purpose = 'billPayment';
                this.pay_data.isInternational = this.isInternatonal;
                this.pay_data.serviceId = 0;
                this.resetApiError();
                if (this.pay_data.uuid != null &&
                    this.pay_data.paymentMode != null &&
                    this.pay_data.amount !== 0) {
                    this.api_success = Messages.PAYMENT_REDIRECT;
                    this.gateway_redirection = true;
                    this.subs.sink = this.sharedServices.consumerPayment(this.pay_data)
                        .subscribe(
                            (data: any) => {
                                this.origin = 'consumer';
                                this.pGateway = data.paymentGateway;
                                if (this.pGateway === 'RAZORPAY') {
                                    this.paywithRazorpay(data);
                                } else {
                                    this.payWithPayTM(data, this.accountId);
                                }
                            },
                            error => {
                                this.isClickedOnce = false;
                                this.resetApiError();
                                this.loadingPaytm = false;
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            }
                        );

                } else if (!this.selected_payment_mode && this.bill_data.amountDue > 0) {
                    this.snackbarService.openSnackBar('Please Choose Payment Option', { 'panelClass': 'snackbarerror' });
                    this.isClickedOnce = false;
                }
            }
        }
    }
    paywithRazorpay(pData: any) {
        this.isClickedOnce = true;
        this.loadingPaytm = true;
        pData.paymentMode = this.selected_payment_mode;
        this.razorpayService.initializePayment(pData, this.accountId, this);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.isClickedOnce = true;
        this.loadingPaytm = true;
        pData.paymentMode = this.selected_payment_mode;
        this.paytmService.initializePayment(pData,accountId, this);
    }

    finishTransaction(status) {
        if (status) {
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    uuid: this.uuid,
                    //  accountId: this.accountId,
                    type: 'waitlist',
                    'paidStatus': true
                }
            };
            if (this.checkIn_type === 'checkin_historybill') {
                this.ngZone.run(() => this.router.navigate(['consumer', 'history'], { queryParams: { 'is_orderShow': 'false' } }));
            } else {
                this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
            }
        } else {
            this.isClickedOnce = false;
            this.loadingPaytm = false;
            this.cdRef.detectChanges();
            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            if (this.checkIn_type === 'checkin_historybill') {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        uuid: this.uuid,
                        accountId: this.accountId,
                        source: 'history'
                    }
                };
                this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras));
            } else {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        uuid: this.uuid,
                        accountId: this.accountId,
                        type: 'waitlist',
                        'paidStatus': false
                    }
                };
                this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras));
            }
        }
    }

    transactionCompleted(response, payload, accountId) {
        if (response.SRC) {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
                    .then((data) => {
                        if (data) {
                            this.finishTransaction(true);
                        }
                    },
                        error => {
                            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                        })
            } else if (response.STATUS == 'TXN_FAILURE') {
                if (response.error && response.error.description) {
                    this.snackbarService.openSnackBar(response.error.description, { 'panelClass': 'snackbarerror' });
                  } 
                this.finishTransaction(false);
            }
        } else {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.paytmService.updatePaytmPay(payload, accountId)
                    .then((data) => {
                        if (data) {
                            this.finishTransaction(true);
                        }
                    },
                        error => {
                            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                        })
            } else if (response.STATUS == 'TXN_FAILURE') {
                this.snackbarService.openSnackBar(response.RESPMSG, { 'panelClass': 'snackbarerror' });
                this.finishTransaction(false);
            }
        }
    }
    closeloading() {
        this.isClickedOnce = false;
        this.loadingPaytm = false;
        this.cdRef.detectChanges();
    }
    paytmPayment() {
        this.isClickedOnce = true;
        this.pay_data.uuid = this.uuid;
        this.pay_data.amount = this.bill_data.amountDue;
        this.pay_data.paymentMode = 'PPI';
        this.pay_data.accountId = this.accountId;
        this.pay_data.purpose = 'billPayment';
        this.resetApiError();
        if (this.pay_data.uuid != null &&
            this.pay_data.paymentMode != null &&
            this.pay_data.amount !== 0) {
            this.api_success = Messages.PAYMENT_REDIRECT;
            this.gateway_redirection = true;
            this.subs.sink = this.sharedServices.consumerPayment(this.pay_data)
                .subscribe(
                    data => {
                        this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                        setTimeout(() => {
                            this.document.getElementById('paytmform').submit();
                        }, 2000);
                    },
                    error => {
                        this.isClickedOnce = false;
                        this.resetApiError();
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
        }
    }
    resetApiError() {
        this.api_success = null;
    }
    /**
   * Apply Jaldee Coupon
   */
    applyJCoupon() {
        if (this.checkCouponValid(this.jCoupon)) {
            this.applyAction(this.jCoupon, this.bill_data.uuid);
        } else {
            this.snackbarService.openSnackBar('Enter a valid coupon', { 'panelClass': 'snackbarerror' });
        }
    }
    clearJCoupon() {
        this.jCoupon = '';
    }
    /**
     * Perform Bill Actions
     * @param action Action Type
     * @param uuid Bill Id
     * @param data Data to be sent as request body
     */
    applyAction(action, uuid) {
        return new Promise<void>((resolve, reject) => {
            this.subs.sink = this.sharedServices.applyCoupon(action, uuid, this.accountId).subscribe
                (billInfo => {
                    this.bill_data = billInfo;
                    this.getWaitlistBill();
                    this.clearJCoupon();
                    resolve();
                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        reject(error);
                    });
        });
    }
    /**
     * To Print Receipt
     */
    printMe() {
        const params = [
            'height=' + screen.height,
            'width=' + screen.width,
            'fullscreen=yes'
        ].join(',');
        const printWindow = window.open('', '', params);
        let bill_html = '';
        bill_html += '<table width="100%">';
        bill_html += '<tr><td	style="text-align:center;font-weight:bold; color:#000000; font-size:11pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-bottom:10px;">' + this.checkin.providerAccount['businessName'] + '</td></tr>';
        bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
        bill_html += '<table width="100%">';
        bill_html += '	<tr style="line-height:20px">';
        bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName + '</td>';
        bill_html += '<td width="50%"	style="text-align:right;color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.dateformat.transformToMonthlyDate(this.billdate) + ' ' + this.billtime + '</td>';
        bill_html += '	</tr>';
        bill_html += '	<tr>';
        bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Bill #' + this.bill_data.billId + '</td>';
        bill_html += '<td style="text-align:right;color:#000000; font-size:10pt;font-family:Ubuntu, Arial,sans-serif;">';
        if (this.bill_data.gstNumber) {
            bill_html += 'GSTIN ' + this.bill_data.gstNumber;
        }
        bill_html += '	</tr>';
        bill_html += '	<tr>';
        if (this.splocation) {
            bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;  text-transform: capitalize !important;">' + this.splocation + '</td>';
        }
        bill_html += '	<tr>';
        if (this.checkin.provider) {
            bill_html += '<td style="color:#000000; text-transform: capitalize !important; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.provider_label + ':' +
                // this.checkin.provider.businessName
                ((this.checkin.provider.businessName) ? this.checkin.provider.businessName : this.checkin.provider.firstName + ' ' + this.checkin.provider.lastName)
                + '</td>';
        }
        bill_html += '</td>';
        bill_html += '	</tr>';
        bill_html += '</table>';
        bill_html += '	</td></tr>';
        for (const service of this.bill_data.service) {
            bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
            bill_html += '<table width="100%"';
            bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
            bill_html += '	<tr >';
            bill_html += '<td width="50%"';
            bill_html += '	style="text-align:left;font-weight:bold;">';
            bill_html += service.serviceName + ' &#x20b9;' + parseFloat(service.price).toFixed(2);
            if (service.getGSTpercentage > 0) {
                bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
            }
            bill_html += '</td>';
            bill_html += '<td width="20%"';
            bill_html += '	style="text-align:right">Qty ' + service.quantity;
            bill_html += '</td>';
            bill_html += '<td width="30%"';
            bill_html += '	style="text-align:right">&#x20b9;' + (service.quantity * service.price).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            if (service.discount && service.discount.length > 0) {
                for (const serviceDiscount of service.discount) {
                    bill_html += '	<tr style="color:#aaa">';
                    bill_html += '<td style="text-align:right;"';
                    bill_html += '	colspan="2">' + serviceDiscount.name + '</td>';
                    bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(serviceDiscount.discountValue).toFixed(2);
                    bill_html += '</td>';
                    bill_html += '	</tr>';
                }

                bill_html += '	<tr style="line-height:0;">';
                bill_html += '<td style="text-align:right" colspan="2"></td>';
                bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd">Â </td>';
                bill_html += '	</tr>';
                bill_html += '	<tr style="font-weight:bold">';
                bill_html += '<td style="text-align:right"colspan="2">Sub Total</td>';
                bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(service.netRate).toFixed(2) + '</td>';
                bill_html += '	</tr>';
            }
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        for (const item of this.bill_data.items) {
            bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
            bill_html += '<table width="100%"';
            bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
            bill_html += '	<tr>';
            bill_html += '<td width="50%" style="text-align:left;font-weight:bold;">' + item.itemName + ' @ &#x20b9;' + parseFloat(item.price).toFixed(2);
            if (item.GSTpercentage > 0) {
                bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
            }
            bill_html += '</td>';
            bill_html += '<td width="20%" style="text-align:right">Qty ' + item.quantity + '</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + (item.quantity * item.price).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            for (const itemDiscount of item.discount) {
                bill_html += '	<tr style="color:#aaa">';
                bill_html += '<td style="text-align:right" colspan="2">' + itemDiscount.name + '</td>';
                bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(itemDiscount.discountValue).toFixed(2) + '</td>';
                bill_html += '	</tr>';
            }
            if (item.discount && item.discount.length > 0) {
                bill_html += '	<tr style="line-height:0;">';
                bill_html += '<td style="text-align:right" colspan="2"></td>';
                bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd">Â </td>';
                bill_html += '	</tr>';
                bill_html += '	<tr style="font-weight:bold">';
                bill_html += '<td style="text-align:right" colspan="2">Sub Total</td>';
                bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(item.netRate).toFixed(2) + '</td>';
                bill_html += '	</tr>';
            }
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        bill_html += '	<tr><td>';
        bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:5px">                                                                             ';
        bill_html += '	<tr style="font-weight: bold">';
        bill_html += '<td width="70%" style="text-align:right">Gross Amount</td>';
        bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netTotal).toFixed(2) + '</td>';
        bill_html += '	</tr>                                                                           ';
        bill_html += '</table>';
        bill_html += '	</td></tr>';

        if (this.bill_data.jdn && this.bill_data.jdn.discount) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
            bill_html += '	<tr style="color:#aaa">';
            bill_html += '<td width="70%" style="text-align:right">JDN</td>';
            bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(this.bill_data.jdn.discount).toFixed(2) + '</td>';
            bill_html += '	</tr>                                                                           ';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        for (const billDiscount of this.bill_data.discount) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
            bill_html += '	<tr style="color:#aaa">';
            bill_html += '<td width="70%" style="text-align:right">' + billDiscount.name + '</td>';
            bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(billDiscount.discValue).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.providerCoupon) {
            for (const [key, value] of Object.entries(this.bill_data.providerCoupon)) {
                // for (const providerCoupon of this.bill_data.providerCoupon) {
                bill_html += '	<tr><td>';
                bill_html += '<table width="100%" style="color:#000000; font-size:10pt;  font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
                bill_html += '	<tr style="color:#aaa">';
                bill_html += '<td width="70%" style="text-align:right">' + key + '</td>';
                bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
                bill_html += '	</tr>                                                                           ';
                bill_html += '</table>';
                bill_html += '	</td></tr>';
            }
        }
        if (this.bill_data.jCoupon) {
            for (const [key, value] of Object.entries(this.bill_data.jCoupon)) {
                bill_html += '	<tr><td>';
                bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
                bill_html += '	<tr style="color:#aaa">';
                bill_html += '<td width="70%" style="text-align:right">' + key + '</td>';
                bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
                bill_html += '	</tr>                                                                           ';
                bill_html += '</table>';
                bill_html += '	</td></tr>';
            }
        }
        if (this.bill_data.taxableTotal !== 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr>';
            bill_html += '<td width="70%" style="text-align:right">Tax ' + this.bill_data.taxPercentage + ' % of &#x20b9;' + parseFloat(this.bill_data.taxableTotal).toFixed(2) + '(CGST-' + (this.bill_data.taxPercentage / 2) + '%, SGST-' + (this.bill_data.taxPercentage / 2) + '%)</td>';
            bill_html += '<td width="30%" style="text-align:right">(+) &#x20b9;' + parseFloat(this.bill_data.totalTaxAmount).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.netRate > 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%"	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr style="font-weight: bold;">';
            bill_html += '<td width="70%" style="text-align:right">Net Total</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netRate).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.totalAmountPaid > 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr style="font-weight: bold;">';
            bill_html += '<td width="70%" style="text-align:right">Amount Paid</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.totalAmountPaid).toFixed(2) + '</td>';
            bill_html += '	</tr>';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.amountDue >= 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%"';
            bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr style="font-weight: bold;"> ';
            bill_html += '<td width="70%" style="text-align:right">Amount Due</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.amountDue).toFixed(2) + '</td>';
            bill_html += '	</tr>                                                                           ';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.amountDue < 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%"';
            bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr style="font-weight: bold;"> ';
            bill_html += '<td width="70%" style="text-align:right">Refundable Amount</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.refund_value).toFixed(2) + '</td>';
            bill_html += '	</tr>                                                                           ';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        if (this.bill_data.refundedAmount > 0) {
            bill_html += '	<tr><td>';
            bill_html += '<table width="100%"';
            bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
            bill_html += '	<tr style="font-weight: bold;"> ';
            bill_html += '<td width="70%" style="text-align:right">Amount refunded</td>';
            bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.refundedAmount).toFixed(2) + '</td>';
            bill_html += '	</tr>                                                                           ';
            bill_html += '</table>';
            bill_html += '	</td></tr>';
        }
        bill_html += '</table>';
        printWindow.document.write('<html><head><title></title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(bill_html);
        printWindow.document.write('</body></html>');
        printWindow.moveTo(0, 0);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
    /**
     * Cash Button Pressed
     */
    cashPayment() {
        this.snackbarService.openSnackBar('Visit ' + this.getTerminologyTerm('provider') + ' to pay by cash');
        setTimeout(() => {
            this.ngZone.run(() => this.router.navigate(['consumer']));
            console.log('redirect to consumer');

        }, 1000);

    }
    checkCouponValid(couponCode) {
        let found = false;
        for (let couponIndex = 0; couponIndex < this.couponList.JC.length; couponIndex++) {
            if (this.couponList.JC[couponIndex].jaldeeCouponCode.trim() === couponCode.trim()) {
                found = true;
                break;
            }
        }
        for (let couponIndex = 0; couponIndex < this.couponList.OWN.length; couponIndex++) {
            if (this.couponList.OWN[couponIndex].couponCode.trim() === couponCode.trim()) {
                found = true;
                break;
            }
        }
        if (found) {
            return true;
        } else {
            return false;
        }
    }
    showJCCouponNote(coupon) {
        if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
        } else {
            if (coupon.value.value === '0.0') {
                this.dialog.open(JcCouponNoteComponent, {
                    width: '50%',
                    panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'jcouponmessagepopupclass'],
                    disableClose: true,
                    data: {
                        jCoupon: coupon
                    }
                });
            }
        }
    }
    backtoProviderDetails() {
        this.locationobj.back();
    }
    changeJcashUse(event) {
        if (event.checked) {
            this.checkJcash = true;
        } else {
            this.checkJcash = false;
        }
    }
}