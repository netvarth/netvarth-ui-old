import { Injectable } from '@angular/core';
import { RazorpayprefillModel } from './razorpayprefill.model';
@Injectable()
export class Razorpaymodel {

    constructor(
        public razorprefillmodel: RazorpayprefillModel
    ) {}
    key: string;
    amount: string;
    order_id: string;
    currency = 'INR';
    name: string;
    description: string;
    image: string;
    retry: boolean;
    prefill = this.razorprefillmodel;
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
}
