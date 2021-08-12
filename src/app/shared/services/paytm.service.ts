import { Injectable } from "@angular/core";

@Injectable()
export class PaytmService {

    constructor(
        // private renderer: Renderer2
    ){}
    initializePayment(pData: any, paytmUrl, referrer) {
        let response = JSON.parse(pData.response);
        console.log(response);
        this.loadPayTMScript(pData, paytmUrl).onload = () => {
            var config = {
                "root": "",
                "flow": "DEFAULT",
                "data": {
                "orderId": pData.orderId, /* update order id */
                "token": response.body.txnToken, /* update token value */
                "tokenType": "TXN_TOKEN",
                "amount": pData.amount /* update amount */
                },
                "merchant": {
                    "mid":pData.merchantId,
                    "redirect": false
                },
                "handler": {
                  "notifyMerchant": function(eventName,data){
                    console.log("notifyMerchant handler function called");
                    console.log("eventName => ",eventName);
                    console.log("data => ",data);
                  },
                  transactionStatus:function(data){
                    console.log("payment status ", data); 
                    window['Paytm'].CheckoutJS.close();
                    referrer.transactionCompleted(data);
                  } 
                }
              };
        console.log(config);
              if(window['Paytm'] && window['Paytm'].CheckoutJS){
                  window['Paytm'].CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
                      // initialze configuration using init method 
                      window['Paytm'].CheckoutJS.init(config).then(function onSuccess() {
                          // after successfully updating configuration, invoke JS Checkout
                          window['Paytm'].CheckoutJS.invoke();
                      }).catch(function onError(error){
                          console.log("error => ",error);
                      });
                  });
              } 
        };
    }
    
    public loadPayTMScript(pData, payTMUrl): HTMLScriptElement {
        const url = payTMUrl + '/merchantpgpui/checkoutjs/merchants/' + pData.merchantId +'.js';
        console.log('preparing to load...')
        let script  = document.createElement('script');
        script.id = pData.orderId;
        script.src = url;
        script.type = 'text/javascript';
        script.async = true;
        script['crossorigin']="anonymous"
        // node.charset = 'utf-8';
        // this.renderer.appendChild(document.body, script);
        document.getElementById('consumer_donation').appendChild(script);
        return script;
    }
    
}