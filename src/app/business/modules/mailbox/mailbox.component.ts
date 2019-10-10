import { Component, OnInit, OnDestroy } from '@angular/core';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Subscription } from 'rxjs/Subscription';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-mailbox',
    templateUrl: './mailbox.component.html'
})
export class MailboxComponent implements OnInit, OnDestroy {
    provider_consumer_cap = Messages.PROVIDER_CONSUMER_CAP;
    service_cap = Messages.SERVICE_CAP;
    message_cap = Messages.MESSAGE_CAP;
    date_time_cap = Messages.DATE_TIME_CAP;
    reply_cap = Messages.REPLY_CAP;
    close_cap = Messages.CLOSE_BTN;
    delete_msg_cap = Messages.DELETE_MSG_CAP;
    no_msg_exists_cap = Messages.NO_MSG_EXISTS_CAP;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
    selectedMsg = -1;
    user_id;
    shownomsgdiv = false;
    hide_reply_button = false;
    terminologies = null;
    usertype = null;
    loading = true;
    cronHandle: Subscription;
    refreshTime = projectConstants.INBOX_REFRESH_TIME;
    inboxUsersList: any = [];
    // msgdialogRef;
    selectedMessage: any = {};
    messageToSend;
    messages: any = [];
    inboxList: any = [];
    groupMessages: any = [];
    showCaptionBox: any = {};
    activeImageCaption: any = [];
    itemCaption: any = [];
    breadcrumbs = [
        {
            title: 'Inbox'
        }
    ];
    userDet;
    obtainedMsgs = false;
    selectedParentIndex;
    selectedChildIndex;
    blogo: any;
    clogo: any;

    constructor(private inbox_services: InboxServices,
        private shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        private provider_services: ProviderServices,
        private router: Router) { }

    ngOnInit() {
        this.userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.terminologies = this.shared_functions.getTerminologies();
        this.usertype = this.shared_functions.isBusinessOwner('returntyp');
        if (this.usertype === 'provider') {
            this.inbox_services.getBussinessProfile()
                .subscribe(
                    (data: any) => {
                        this.user_id = data.id;
                        this.loading = false;
                        this.provider_services.getProviderLogo().subscribe(
                            logo => {
                                if (logo[0]) {
                                  this.blogo = logo[0].url;
                                } else {
                                    this.blogo = 'img-null.svg';
                                }
                                this.clogo = '../../../assets/images/avatar5.png';
                            });
                    },
                    () => {
                        this.loading = false;
                    }
                );
        } else {
            const userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
            this.user_id = userDet.id;
            this.loading = false;
        }
        this.getInboxMessages();
        // this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
        //     this.reloadApi.emit();
        // });
    }
    setActiveMessage(message, parentIndex, childIndex) {
        if (message.messagestatus === 'out' || this.selectedMessage && this.selectedMessage[parentIndex] && childIndex === this.selectedChildIndex) {
            delete this.selectedMessage[parentIndex];
            this.selectedParentIndex = null;
            this.selectedChildIndex = null;
        } else {
            this.selectedMessage[parentIndex] = {};
            this.selectedMessage[parentIndex]['message'] = message;
            this.selectedParentIndex = parentIndex;
            this.selectedChildIndex = childIndex;
            console.log(this.selectedMessage);
        }
    }
    getInboxMessages() {
        const usertype = this.shared_functions.isBusinessOwner('returntyp');
        this.inbox_services.getInbox(usertype)
            .subscribe(
                data => {
                    this.messages = data;
                    this.sortMessages();
                    this.generateCustomInbox(data);
                    this.groupMessages = this.shared_functions.groupBy(this.inboxList, 'username');
                    this.inboxUsersList = [];
                    Object.keys(this.groupMessages).forEach(key => {
                        const inboxList = this.groupMessages[key];
                        const timestamp = this.groupMessages[key][0]['timestamp'];
                        const lastmessage = this.groupMessages[key][0]['message'];
                        const inboxUserList = {
                            userKey: key,
                            inboxList: inboxList.reverse(),
                            latestTime: timestamp,
                            latestMessage: lastmessage
                        };
                        this.inboxUsersList.push(inboxUserList);
                    });
                    this.obtainedMsgs = true;
                    this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
                },
                () => {
                }
            );
    }
    sendMessage(messageToSend, inboxList, parentIndex) {
        const userId = this.getReceiverId(inboxList);
        let uuid = null;
        if (this.selectedMessage && this.selectedMessage[parentIndex]) {
            if (this.selectedMessage[parentIndex].message.waitlistid) {
                uuid = 'h_' + this.selectedMessage[parentIndex].message.waitlistid;
            }
        }
        if (uuid) {
            const dataToSend: FormData = new FormData();
            dataToSend.append('message', messageToSend);
            const captions = {};
            let i = 0;
            if (this.selectedMessage && this.selectedMessage[parentIndex] && this.selectedMessage[parentIndex]['pics']) {
                for (const pic of this.selectedMessage[parentIndex]['pics'].files) {
                    dataToSend.append('attachments', pic, pic['name']);
                    captions[i] = 'caption';
                    i++;
                }
            }
            const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
            dataToSend.append('captions', blobPropdata);
            this.providerToConsumerWaitlistNote(dataToSend, uuid);
        } else {
            const communications = {
                communicationMessage: messageToSend
            };
            this.providerToConsumerNoteAdd(communications, userId);
        }
    }
    getReceiverId(inboxList) {
        let receiverid;
        inboxList.forEach(element => {
            if (element.ownerId === this.user_id) {
                receiverid = element.receiverId;
                return false;
            }
        });
        return receiverid;
    }
    sortMessages() {
        this.messages.sort(function (message1, message2) {
            if (message1.timeStamp < message2.timeStamp) {
                return 11;
            } else if (message1.timeStamp > message2.timeStamp) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    generateCustomInbox(messages: any) {
        this.inboxList = [];
        let senderName;
        let senderId;
        let messageStatus;
        for (const message of messages) {
            senderName = message.owner.userName;
            senderId = message.owner.id;
            messageStatus = 'in';
            if (senderId === message.accountId) {
                senderId = message.receiver.id;
                senderName = message.receiver.userName;
                messageStatus = 'out';
            }
            const inboxData = {
                timestamp: message.timeStamp,
                username: senderName,
                service: message.service,
                message: message.msg,
                ownerId: message.owner.id,
                waitlistid: message.waitlistId,
                messagestatus: messageStatus,
                receiverId: message.receiver.id,
                attachments: message.attachements
            };
            this.inboxList.push(inboxData);
        }
        localStorage.setItem('inbox', JSON.stringify(this.inboxList));
    }
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
    }
    providerToConsumerWaitlistNote(post_data, uuid) {
        // this.disableButton = true;
        this.shared_services.addProviderWaitlistNote(uuid,
            post_data)
            .subscribe(
                () => {
                    this.getInboxMessages();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    // this.disableButton = false;
                }
            );
    }
    providerToConsumerNoteAdd(post_data, consumerid) {
        if (this.user_id !== null) {
            this.shared_services.addProvidertoConsumerNote(consumerid,
                post_data)
                .subscribe(
                    () => {
                        this.getInboxMessages();
                    },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
        }
    }
    formatDateDisplay(dateStr) {
        let retdate = '';
        const pubDate = new Date(dateStr);
        const obtdate = new Date(pubDate.getFullYear() + '-' + this.shared_functions.addZero((pubDate.getMonth() + 1)) + '-' + this.shared_functions.addZero(pubDate.getDate()));
        const obtshowdate = this.shared_functions.addZero(pubDate.getDate()) + '/' + this.shared_functions.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
        const obtshowtime = this.shared_functions.addZero(pubDate.getHours()) + ':' + this.shared_functions.addZero(pubDate.getMinutes());
        const today = new Date();
        const todaydate = new Date(today.getFullYear() + '-' + this.shared_functions.addZero((today.getMonth() + 1)) + '-' + this.shared_functions.addZero(today.getDate()));
        if (obtdate.getTime() === todaydate.getTime()) {
            retdate = this.shared_functions.convert24HourtoAmPm(obtshowtime);
        } else {
            retdate = obtshowdate + ' ' + this.shared_functions.convert24HourtoAmPm(obtshowtime);
        }
        return retdate;
    }
    filesSelected(event, parentIndex) {
        const input = event.target.files;
        if (input) {
            if (this.selectedMessage && this.selectedMessage[parentIndex] && this.selectedMessage[parentIndex]['pics']) {
            } else {
                if (!this.selectedMessage[parentIndex]) {
                    this.selectedMessage[parentIndex] = {};
                }
                if (!this.selectedMessage[parentIndex]['pics']) {
                    this.selectedMessage[parentIndex]['pics'] = {
                        files: [],
                        base64: [],
                        caption: []
                    };
                }
            }
            for (const file of input) {
                this.selectedMessage[parentIndex]['pics'].files.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.selectedMessage[parentIndex]['pics'].base64.push(e.target['result']);
                };
                reader.readAsDataURL(file);
            }
        }
        console.log(this.selectedMessage[parentIndex]);
    }
    addCaption(caption, parentIndex, index) {
        console.log(caption);
        console.log(this.activeImageCaption[parentIndex][index]);
        // this.pics.caption[index] = e;
        // const caption = {
        //  index : e
        // };
        // console.log(caption);
        // const blobPropdata = new Blob([JSON.stringify(caption)], { type: 'application/json' });
        // console.log(blobPropdata);
        // this.showCaptionBox[index] = false;
        // console.log(this.pics);
        this.showCaptionBox[parentIndex][index] = false;
    }
    deleteTempImage(index, parentIndex) {
        this.selectedMessage[parentIndex]['pics'].files.splice(index, 1);
        if (this.showCaptionBox[parentIndex] && this.showCaptionBox[parentIndex][index]) {
            delete this.showCaptionBox[parentIndex][index];
            delete this.activeImageCaption[parentIndex][index];
        }
    }
    captionMenuClicked(index, parentIndex) {
        if (!this.activeImageCaption[parentIndex]) {
            this.activeImageCaption[parentIndex] = {};
            this.activeImageCaption[parentIndex][index] = '';
        }
        if (!this.showCaptionBox[parentIndex]) {
            this.showCaptionBox[parentIndex] = {};
        }
        this.showCaptionBox[parentIndex][index] = true;
    }
    closeCaptionMenu(index, parentIndex) {
        if (this.showCaptionBox[parentIndex] && this.showCaptionBox[parentIndex][index]) {
            delete this.activeImageCaption[parentIndex][index];
            this.showCaptionBox[parentIndex][index] = false;
        }
    }
}
