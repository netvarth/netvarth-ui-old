import { Injectable } from '@angular/core';
import { RazorpayprefillModel } from './razorpayprefill.model';
@Injectable()
export class Razorpaymodel {
    key: string;
    amount: string;
    order_id: string;
    currency = 'INR';
    name: string;
    description: string;
    image: string;
    retry: boolean;
    prefill:any;
    modal: {
        // We should prevent closing of the form when esc key is pressed.
    escape: false,
        };
    notes: {
    // include notes if any
    };
    theme: {
    color: '#F37254'
    };

    constructor(
        public razorprefillmodel: RazorpayprefillModel
    ) {
        this.prefill=razorprefillmodel;
    }
}
 
