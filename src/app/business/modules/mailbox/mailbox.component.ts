import { Component, OnInit, OnDestroy, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Subscription } from 'rxjs';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
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
    selectedMessage: any = {};
    messageToSend;
    messages: any = [];
    inboxList: any = [];
    groupMessages: any = [];
    showCaptionBox: any = {};
    activeImageCaption: any = [];
    itemCaption: any = [];
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Inbox'
        }
    ];
    userDet;
    domain: any;
    obtainedMsgs = false;
    api_loading = true;
    selectedParentIndex;
    selectedChildIndex;
    blogo: any;
    clogo: any;
    showImages: any = [];
    openState: any = [];
    type;
    @ViewChildren('msgId') msgIds: QueryList<ElementRef>;
    constructor(private inbox_services: InboxServices,
        private shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        private routerobj: Router,
        private provider_services: ProviderServices) { }

    ngOnInit() {
        this.userDet = this.shared_functions.getitemFromGroupStorage('ynw-user');
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'inbox',
            'actions': [
                { 'title': 'Help', 'type': 'learnmore' }]
        };
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
                                    this.blogo = '../../../assets/images/img-null.svg';
                                }
                                this.clogo = '../../../assets/images/avatar5.png';
                            });
                    },
                    () => {
                        this.loading = false;
                    }
                );
        } else {
            const userDet = this.shared_functions.getitemFromGroupStorage('ynw-user');
            this.user_id = userDet.id;
            this.loading = false;
        }
        this.getInboxMessages();
        // this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
        //     this.reloadApi.emit();
        // });
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/inbox']);
        }
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
                    this.groupMessages = this.shared_functions.groupBy(this.inboxList, 'accountId');
                    this.inboxUsersList = [];
                    Object.keys(this.groupMessages).forEach(key => {
                        const unreadMessages = this.groupMessages[key].filter(
                            mail => !mail.read && mail.messagestatus === 'in');
                        const inboxList = this.groupMessages[key];
                        const timestamp = this.groupMessages[key][0]['timestamp'];
                        const lastmessage = this.groupMessages[key][0]['message'];
                        const inboxUserList = {
                            userKey: this.groupMessages[key][0]['username'],
                            inboxList: inboxList.reverse(),
                            latestTime: timestamp,
                            latestMessage: lastmessage,
                            unreadCount: unreadMessages.length
                        };
                        this.inboxUsersList.push(inboxUserList);
                    });
                    this.obtainedMsgs = true;
                    this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
                    this.api_loading = false;
                },
                () => {
                }
            );
    }
    getUnreadCount() {
        this.shared_services.getInboxUnreadCount('provider')
            .subscribe(data => {
                this.shared_functions.sendMessage({ ttype: 'unreadCount', unreadCount: data });
            },
                () => {
                });
    }
    sendMessage(messageToSend, inboxList, parentIndex) {
        // const userId = this.getReceiverId(inboxList);
        const userId = inboxList[0].accountId;
        let uuid = null;
        if (this.selectedMessage && this.selectedMessage[parentIndex]) {
            if (this.selectedMessage[parentIndex].message.waitlistid) {
                uuid = this.selectedMessage[parentIndex].message.waitlistid;
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
            if (userId) {
                this.providerToConsumerNoteAdd(communications, userId);
            }
        }
    }
    getReceiverId(inboxList) {
        let receiverid;
        inboxList.forEach(element => {
            if (element.ownerId === element.receiverId) {
                receiverid = element.receiverId;
                return false;
            } else {
                receiverid = element.ownerId;
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
        // let senderId;
        let messageStatus;
        let accountId;
        for (const message of messages) {
            if (message.receiver.id === this.userDet.id) {
                accountId = message.owner.id;
                senderName = message.owner.name;
                // senderId = message.owner.id;
                messageStatus = 'in';
            } else {
                accountId = message.receiver.id;
                // senderId = message.receiver.id;
                senderName = message.receiver.name;
                messageStatus = 'out';
            }
            const inboxData = {
                accountId: accountId,
                timestamp: message.timeStamp,
                username: senderName,
                service: message.service,
                message: message.msg,
                ownerId: message.owner.id,
                waitlistid: message.waitlistId,
                messagestatus: messageStatus,
                receiverId: message.receiver.id,
                attachments: message.attachements,
                messageId: message.messageId,
                read: message.read
            };
            this.inboxList.push(inboxData);
        }
        // for (const message of messages) {
        //     senderName = message.owner.name;
        //     senderId = message.owner.id;
        //     messageStatus = 'in';
        //     if (senderId === message.receiver.id) {
        //         senderId = message.receiver.id;
        //         senderName = message.receiver.name;
        //         messageStatus = 'out';
        //     }
        //     if (message.receiver.id === message.owner.id) {
        //         accountId = message.accountId;
        //     } else {
        //         accountId = message.owner.id;
        //     }
        //     const inboxData = {
        //         accountId: accountId,
        //         timestamp: message.timeStamp,
        //         username: senderName,
        //         service: message.service,
        //         message: message.msg,
        //         ownerId: message.owner.id,
        //         waitlistid: message.waitlistId,
        //         messagestatus: messageStatus,
        //         receiverId: message.receiver.id,
        //         attachments: message.attachements,
        //         messageId: message.messageId,
        //         read: message.read
        //     };
        //     this.inboxList.push(inboxData);
        // }
        localStorage.setItem('inbox', JSON.stringify(this.inboxList));
    }
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
    }
    providerToConsumerWaitlistNote(post_data, uuid) {
        // this.disableButton = true;
        if (uuid && uuid.indexOf('appt') >= 0) {
            this.type = 'appt';
        } else {
            this.type = 'wl';
        }
        if (this.type === 'appt') {
            this.shared_services.addProviderAppointmentNote(uuid,
                post_data)
                .subscribe(
                    () => {
                        this.messageToSend = '';
                        this.selectedMessage = [];
                        this.getInboxMessages();
                    },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        // this.disableButton = false;
                    }
                );
        } else {
            this.shared_services.addProviderWaitlistNote(uuid,
                post_data)
                .subscribe(
                    () => {
                        this.messageToSend = '';
                        this.selectedMessage = [];
                        this.getInboxMessages();
                    },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        // this.disableButton = false;
                    }
                );
        }

    }
    providerToConsumerNoteAdd(post_data, consumerid) {
        if (this.user_id !== null) {
            this.shared_services.addProvidertoConsumerNote(consumerid,
                post_data)
                .subscribe(
                    () => {
                        this.messageToSend = '';
                        this.selectedMessage = [];
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
    }
    addCaption(caption, parentIndex, index) {
        // this.pics.caption[index] = e;
        // const caption = {
        //  index : e
        // };
        // const blobPropdata = new Blob([JSON.stringify(caption)], { type: 'application/json' });
        // this.showCaptionBox[index] = false;
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
    getThumbUrl(attachment) {
        if (attachment.s3path.indexOf('.pdf') !== -1) {
            return attachment.thumbPath;
        } else {
            return attachment.s3path;
        }
    }
    showImagesection(index) {
        (this.showImages[index]) ? this.showImages[index] = false : this.showImages[index] = true;
    }
    readConsumerMessages(messages, index) {
        const messageIds = [];
        for (const message of messages) {
            if (!message.read && message.messagestatus === 'in') {
                messageIds.push(message.messageId);
            }
        }
        const messageids = messageIds.toString();
        const leng = messages.length;
        if (messageids) {
            this.provider_services.readConsumerMessages(messages[0].accountId, messageids.split(',').join('-')).subscribe(data => {
                this.getInboxMessages();
                this.getUnreadCount();
                this.openState[index] = true;
                setTimeout(() => {
                    this.scrollToSection(messages[leng - 1]);
                }, 1000);
            });
        } else {
            this.scrollToSection(messages[leng - 1]);
        }
    }
    scrollToSection(messageList) {
        this.msgIds.toArray().forEach(element => {
            if (element.nativeElement.innerHTML.trim() === messageList.message.trim()) {
                element.nativeElement.scrollIntoViewIfNeeded();
                return false;
            }
        });
    }
}
