import { OnInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
    selector: 'app-jc-coupon-note',
    templateUrl: './jc-coupon-note.component.html'
})

export class JcCouponNoteComponent implements OnInit {
    coupon_notes = projectConstants.COUPON_NOTES;
    jCouponMsg;
    couponName;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    ngOnInit() {
        this.jCouponMsg = this.data.jCoupon.value.systemNote;
        this.couponName = this.data.jCoupon.key;
    }
}
