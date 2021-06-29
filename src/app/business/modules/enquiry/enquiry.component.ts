import { Component, OnInit } from '@angular/core';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

  messages: any = [];
  enquiries: any = [];
  users: any = [];
  userDet: any = [];
  loading = true;
  newTimeDateFormat = projectConstantsLocal.DATE_FORMAT_WITH_TIME;
  enquiryUnreadCount;
  customer_label;
  constructor(private shared_functions: SharedFunctions,
    private inbox_services: InboxServices,
    private groupService: GroupStorageService,
    private provider_services: ProviderServices,
    private dateTimeProcessor: DateTimeProcessor,
    public wordProcessor: WordProcessor,
    private router: Router) { }
  ngOnInit(): void {
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.userDet.accountType === 'BRANCH') {
      this.getUsers();
    } else {
      this.getInboxMessages();
    }
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  getUsers() {
    const filter = {};
    filter['userType-eq'] = 'PROVIDER';
    this.provider_services.getUsers(filter).subscribe(
      (data: any) => {
        this.users = data;
        this.getInboxMessages();
      }, error => {
      });
  }
  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          this.sortMessages();
          const inbox = this.generateCustomInbox(this.messages);
          console.log(inbox);
          this.enquiries = inbox.filter(msg => msg.msgType === 'ENQUIRY' && !msg.replyMsgId && msg.messagestatus === 'in');
          const enq = this.enquiries.filter(msg => !msg.read);
          this.enquiryUnreadCount = (enq) ? enq.length : 0;
          this.loading = false;
        });
  }
  searchUserById(id) {
    const user = this.users.filter(user => user.id === id);
    return user;
  }
  generateCustomInbox(messages: any) {
    let inboxList = [];
    let senderName;
    let messageStatus;
    let accountId;
    let providerId;
    let providerName;
    for (const message of messages) {
      if (this.searchUserById(message.receiver.id).length > 0 || message.receiver.id === 0 || message.receiver.id === this.userDet.id) {
        accountId = message.owner.id;
        senderName = message.owner.name;
        providerId = message.receiver.id;
        if (message.receiver.id === 0 || message.receiver.id === this.userDet.id) {
          providerName = message.accountName;
        } else {
          providerName = (this.searchUserById(message.receiver.id)[0].businessName) ? this.searchUserById(message.receiver.id)[0].businessName : this.searchUserById(message.receiver.id)[0].firstName + ' ' + this.searchUserById(message.receiver.id)[0].lastName;
        }
        messageStatus = 'in';
      } else if (this.searchUserById(message.owner.id).length > 0 || message.owner.id === 0 || message.owner.id === this.userDet.id) {
        accountId = message.receiver.id;
        providerId = message.owner.id;
        senderName = message.receiver.name;
        messageStatus = 'out';
        if (message.owner.id === 0 || message.owner.id === this.userDet.id) {
          providerName = message.accountName;
        } else {
          providerName = (this.searchUserById(message.owner.id)[0].businessName) ? this.searchUserById(message.owner.id)[0].businessName : this.searchUserById(message.owner.id)[0].firstName + ' ' + this.searchUserById(message.owner.id)[0].lastName;
        }
      }
      const inboxData = {
        accountId: accountId,
        timeStamp: message.timeStamp,
        accountName: (senderName && senderName.trim() !== '') ? senderName : this.customer_label,
        service: message.service,
        msg: message.msg,
        providerId: providerId,
        providerName: providerName,
        waitlistId: message.waitlistId,
        messagestatus: messageStatus,
        attachements: (message.attachements) ? message.attachements : [],
        messageId: message.messageId,
        read: message.read,
        msgType: message.messageType
      };
      if (message.replyMessageId) {
        inboxData['replyMsgId'] = message.replyMessageId;
      }
      inboxList.push(inboxData);
    }
    return inboxList;
  }
  getUser(user) {
    const name = user.split(' ');
    let nameShort = name[0].charAt(0);
    if (name.length > 1) {
      nameShort = nameShort + name[name.length - 1].charAt(0);
    }
    return nameShort.toUpperCase();
  }
  formatDateDisplay(dateStr) {
    let retdate = '';
    const pubDate = new Date(dateStr);
    const obtdate = new Date(pubDate.getFullYear() + '-' + this.dateTimeProcessor.addZero((pubDate.getMonth() + 1)) + '-' + this.dateTimeProcessor.addZero(pubDate.getDate()));
    const obtshowdate = this.dateTimeProcessor.addZero(pubDate.getDate()) + '/' + this.dateTimeProcessor.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
    const obtshowtime = this.dateTimeProcessor.addZero(pubDate.getHours()) + ':' + this.dateTimeProcessor.addZero(pubDate.getMinutes());
    const today = new Date();
    const todaydate = new Date(today.getFullYear() + '-' + this.dateTimeProcessor.addZero((today.getMonth() + 1)) + '-' + this.dateTimeProcessor.addZero(today.getDate()));
    if (obtdate.getTime() === todaydate.getTime()) {
      retdate = this.dateTimeProcessor.convert24HourtoAmPm(obtshowtime);
    } else {
      retdate = obtshowdate + ' ' + this.dateTimeProcessor.convert24HourtoAmPm(obtshowtime);
    }
    return retdate;
  }
  gotoInbox(msg) {
    this.router.navigate(['provider/enquiry/chat'], { queryParams: { customer: msg.accountId, provider: msg.providerId } });
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
}
