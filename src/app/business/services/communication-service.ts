import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddInboxMessagesComponent } from "../../shared/components/add-inbox-messages/add-inbox-messages.component";
import { CommonDataStorageService } from "../../shared/services/common-datastorage.service";

@Injectable()
export class CommunicationService {
    sendglobalmsgdialogRef;
    constructor(
        public common_datastorage: CommonDataStorageService,
        public dialog: MatDialog
    ) { }
    ConsumerInboxMessage(customerlist, source?) {
        const custids = [];
        let type;
        let ynwcustid;
        let custid = [];
        let name;
        let phone;
        let email;
        let countryCode;
        if (customerlist.length > 1 || source === 'donation-list') {
            type = 'multiple';
            for (const custlst of customerlist) {
                if (source === 'donation-list') {
                    custids.push(custlst.uid);
                } else {
                    custids.push(custlst.id);
                }
            }
            if (customerlist.length === 1) {
                const fname = (customerlist[0].donor.firstName) ? customerlist[0].donor.firstName : '';
                const lname = (customerlist[0].donor.lastName) ? customerlist[0].donor.lastName : '';
                name = fname + ' ' + lname;
            }
            phone = customerlist[0].phoneNo;
            countryCode = customerlist[0].countryCode;
            email = customerlist[0].email;
        } else if (customerlist.length === 1 && source !== 'donation-list') {
            type = 'single';
            custid = customerlist[0].id || null;
            const fname = (customerlist[0].firstName) ? customerlist[0].firstName : '';
            const lname = (customerlist[0].lastName) ? customerlist[0].lastName : '';
            name = fname + ' ' + lname;
            phone = customerlist[0].phoneNo;
            countryCode = customerlist[0].countryCode;
            email = customerlist[0].email;
        }
        if (type === 'single') {
            ynwcustid = custid;
        } else {
            ynwcustid = custids;
        }
        if (customerlist.length === 1) {
            type = 'single';
        }
        const terminologies = this.common_datastorage.get('terminologies');
        return new Promise<void>((resolve, reject) => {
            this.sendglobalmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'loginmainclass', 'smallform'],
                disableClose: true,
                data: {
                    typeOfMsg: type,
                    uuid: ynwcustid,
                    source: source,
                    type: 'send',
                    terminologies: terminologies,
                    name: name,
                    email: email,
                    phone: phone,
                    countryCode: countryCode
                }
            });

            this.sendglobalmsgdialogRef.afterClosed().subscribe(result => {
                if (result === 'reloadlist') {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }
    addConsumerInboxMessage(waitlist, Cthis?, appt?) {
        const uuids = [];
        let type;
        let ynwUuid;
        let uuid;
        let name;
        let email;
        let phone;
        let countryCode;
        let phone_history;
        let jaldeeConsumer = 'false';
        if (waitlist.length > 1) {
            type = 'multiple';
            for (const watlst of waitlist) {
                if (appt === 'appt') {
                    uuids.push(watlst.uid);
                } else if (appt === 'order-provider') {
                    uuids.push(watlst.uid);
                } else {
                    uuids.push(watlst.ynwUuid);
                }
            }
        } else {
            type = 'single';
            if (appt === 'appt') {
                uuid = waitlist[0].uid || null;
                let fname = '';
                let lname = '';
                if (waitlist[0].appmtFor[0].firstName) {
                    fname = waitlist[0].appmtFor[0].firstName;
                }
                if (waitlist[0].appmtFor[0].lastName) {
                    lname = waitlist[0].appmtFor[0].lastName;
                }
                name = fname + ' ' + lname;
                email = waitlist[0].providerConsumer.email;
                phone = waitlist[0].providerConsumer.phoneNo;
                countryCode = waitlist[0].countryCode;
                if (waitlist[0].consumer) {
                    jaldeeConsumer = 'true';
                }
            } else if (appt === 'order-provider') {
                uuid = waitlist[0].uid || null;
                let fname = '';
                let lname = '';
                if (waitlist[0].orderFor.firstName) {
                    fname = waitlist[0].orderFor.firstName;
                }
                if (waitlist[0].orderFor.lastName) {
                    lname = waitlist[0].orderFor.lastName;
                }
                name = fname + ' ' + lname;
                email = waitlist[0].email;
                phone = waitlist[0].phoneNumber;
                countryCode = waitlist[0].countryCode;
                if (waitlist[0].jaldeeConsumer) {
                    jaldeeConsumer = 'true';
                }
            } else {
                uuid = waitlist[0].ynwUuid || null;
                let fname = '';
                let lname = '';
                if (waitlist[0].waitlistingFor[0].firstName) {
                    fname = waitlist[0].waitlistingFor[0].firstName;
                }
                if (waitlist[0].waitlistingFor[0].lastName) {
                    lname = waitlist[0].waitlistingFor[0].lastName;
                }
                name = fname + ' ' + lname;
                email = waitlist[0].waitlistingFor[0].email;
                phone = waitlist[0].waitlistingFor[0].phoneNo;
                countryCode = waitlist[0].countryCode;
                phone_history = waitlist[0].waitlistPhoneNumber;
                if (waitlist[0].jaldeeConsumer) {
                    jaldeeConsumer = 'true';
                }
            }
        }
        if (type === 'single') {
            ynwUuid = uuid;
        } else {
            ynwUuid = uuids;
        }
        const terminologies = this.common_datastorage.get('terminologies');
        return new Promise<void>((resolve, reject) => {
            Cthis.sendmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'loginmainclass', 'smallform'],
                disableClose: true,
                data: {
                    typeOfMsg: type,
                    uuid: ynwUuid,
                    source: 'provider-waitlist',
                    type: 'send',
                    terminologies: terminologies,
                    name: name,
                    appt: appt,
                    email: email,
                    phone: phone,
                    countryCode: countryCode,
                    phone_history: phone_history,
                    jaldeeConsumer: jaldeeConsumer
                }
            });

            Cthis.sendmsgdialogRef.afterClosed().subscribe(result => {
                console.log(result);
                if (result === 'reloadlist') {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }
}