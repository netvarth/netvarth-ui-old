import { Injectable } from "@angular/core";
import { projectConstantsLocal } from '../constants/project-constants';
import { SharedServices } from './shared-services';

@Injectable()
export class PaytmService {
    paymentModes=[
         'NB','CC','DC','UPI','PPI','CARD'
      ];
    constructor(
        private sharedServices: SharedServices
    ) { }
    initializePayment(pData: any, paytmUrl, accountId, referrer) {
        let response = JSON.parse(pData.response);
        if(pData.paymentMode==='CC'||pData.paymentMode==='DC'){
            pData.paymentMode='CARD';
        }
        const paymentModesHidden=this.paymentModes.filter(obj=>obj!==pData.paymentMode);
        const paytm_payload = {

            "paymentId": pData.orderId,
            "orderId": pData.orderId,
            "siganature": response.signature

        };
        console.log('response' + JSON.stringify(response));
        this.loadPayTMScript(pData, paytmUrl, referrer).onload = () => {
            var config = {
                "root": "",
                "flow": "DEFAULT",
                "data": {
                    "orderId": pData.orderId, /* update order id */
                    "token": response.body.txnToken, /* update token value */
                    "tokenType": "TXN_TOKEN",
                    "amount": pData.amount
                  
                    
                },
                
                "merchant": {
                    "mid": pData.merchantId,
                    "redirect": false
                },
                "payMode":{
                    "filter":{
                        'exclude':paymentModesHidden
                    }
                },
                "handler": {
                    "notifyMerchant": function (eventName, data) {
                        console.log("notifyMerchant handler function called");
                        console.log("eventName => ", eventName);
                        console.log("data => ", data);
                        referrer.closeloading();

                    },
                    transactionStatus: function (data) {
                        console.log("payment status ", data);
                        console.log(paytm_payload);
                        // console.log("payment status ", JSON.stringify(data));
                        window['Paytm'].CheckoutJS.close();
                        if (data) {
                            referrer.transactionCompleted(data, paytm_payload, accountId);
                        } else {
                            referrer.transactionCompleted({STATUS:'TXN_SUCCESS'}, paytm_payload, accountId);
                        }         
                        // referrer.closeloading();
                    }
                }
            };
            console.log(config);
            if (window['Paytm'] && window['Paytm'].CheckoutJS) {
                window['Paytm'].CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
                    // initialze configuration using init method 
                    window['Paytm'].CheckoutJS.init(config).then(function onSuccess() {
                        // after successfully updating configuration, invoke JS Checkout
                        window['Paytm'].CheckoutJS.invoke();
                    }).catch(function onError(error) {
                        console.log("error => ", error);
                        window['Paytm'].CheckoutJS.close();
                        referrer.closeloading();
                    });
                });

            }
        };

        setTimeout(() => {
            window['Paytm'].CheckoutJS.close();
            referrer.closeloading();
        }, 600000);
    }


    public loadPayTMScript(pData, payTMUrl, isfrom): HTMLScriptElement {
        let payTmurl;
        if (pData.paymentEnv == 'production') {
            payTmurl = projectConstantsLocal.PAYTM_URL;
        } else {
            payTmurl = projectConstantsLocal.PAYTMLOCAL_URL;
        }
        const url = payTmurl + '/merchantpgpui/checkoutjs/merchants/' + pData.merchantId + '.js';
        console.log('preparing to load...')
        let script = document.createElement('script');
        script.id = pData.orderId;
        script.src = url;
        script.type = 'text/javascript';
        script.async = true;
        script['crossorigin'] = "anonymous"
        // node.charset = 'utf-8';
        // this.renderer.appendChild(document.body, script);
        console.log(isfrom.paytmview);
        // document.getElementById('consumer_donation').appendChild(script);
        isfrom.paytmview.nativeElement.appendChild(script);
        return script;
    }
    updatePaytmPay(payload, account_id) {
        return new Promise((resolve, reject) => {

            this.sharedServices.updatePaytmPay(payload, account_id)
                .subscribe(result => {
                    console.log('result' + result);
                    resolve(result);
                }, error => {
                    reject(false);
                })

        })


    }
    updatePaytmPayForProvider(payload, ) {
        return new Promise((resolve, reject) => {

            this.sharedServices.updatePaytmPayProvider(payload)
                .subscribe(result => {
                    console.log('result' + result);
                    resolve(result);
                }, error => {
                    reject(false);
                })

        })


    }

}