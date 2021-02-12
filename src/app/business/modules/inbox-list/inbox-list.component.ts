
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-provider-inbox-list',
  templateUrl: './inbox-list.component.html',
  styleUrls: ['./inbox-list.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class InboxListComponent implements OnInit, OnDestroy {
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
  terminologies = null;
  usertype = null;
  loading = false;
  cronHandle: Subscription;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  msgdialogRef;
  fileTooltip = Messages.FILE_TOOLTIP;
  tooltipcls = '';
  showImages: any = [];
  messages: any = [];
  users: any = [];
  domain: any;
  breadcrumb_moreoptions: any = [];
  breadcrumbs = [
    {
      title: 'Inbox'
    }
  ];
  inboxCntFetched;
  inboxUnreadCnt;
  groupedMsgs: any = [];
  selectedUserMessages: any = [];
  message = '';
  providerName = '';
  selectedCustomer = '';
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  showChat = false;
  screenWidth;
  small_device_display = false;
  sendMessageCompleted = true;
  userScrollHeight;
  msgScrollHeight;
  @ViewChild('scrollMe') scrollFrame: ElementRef;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  image_list_popup: Image[];
  image_list_popup_temp: Image[];
  imageAllowed = ['JPEG', 'JPG', 'PNG'];
  userDet;
  inboxList: any = [];
  selectedUser;
  businesDetails: any = [];
  msgDisplay = 'all';
  groupedMsgsbyUser: any = [];
  cacheavoider;
  constructor(
    private inbox_services: InboxServices,
    private dialog: MatDialog,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    private routerobj: Router,
    private groupService: GroupStorageService,
    public wordProcessor: WordProcessor,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    const cnow = new Date();
    const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
    this.cacheavoider = dd;
    this.userDet = this.selectedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.businesDetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.domain = this.userDet.sector;
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'inbox',
      'actions': [
        { 'title': 'Help', 'type': 'learnmore' }]
    };
    if (this.userDet.accountType === 'BRANCH') {
      this.getUsers();
    } else {
      this.getInboxMessages();
    }
    this.terminologies = this.wordProcessor.getTerminologies();
    this.inbox_services.getBussinessProfile()
      .subscribe(
        (data: any) => {
          this.user_id = data.id;
        },
        () => {
        }
      );
    this.loading = true;
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.msgdialogRef) {
      this.msgdialogRef.close();
    }
  }

  readConsumerMessages(consumerId, messageId, providerId) {
    this.provider_services.readConsumerMessages(consumerId, messageId, providerId).subscribe(data => {
      this.getInboxUnreadCnt();
      this.getInboxMessages();
    });
  }
  getInboxUnreadCnt() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (!usertype) {
      if (this.cronHandle) {
        this.cronHandle.unsubscribe();
      }
    }
    let type;
    type = usertype;
    this.shared_service.getInboxUnreadCount(type)
      .subscribe(data => {
        this.inboxCntFetched = true;
        this.inboxUnreadCnt = data;
        this.shared_functions.sendMessage({ ttype: 'messageCount', messageFetched: this.inboxCntFetched, unreadCount: this.inboxUnreadCnt });
      },
        () => {
        });
  }


  replyMessage(message) {
    const pass_ob = {};
    let source = 'provider-';
    if (message.waitlistId) {
      source = source + 'waitlist-inbox';
      pass_ob['uuid'] = 'h_' + message.waitlistId;
    } else {
      source = source + 'common';
    }
    pass_ob['source'] = source;
    pass_ob['user_id'] = message.owner.id;
    pass_ob['type'] = 'reply';
    pass_ob['terminologies'] = this.terminologies;
    pass_ob['name'] = message.owner.name;
    pass_ob['typeOfMsg'] = 'single';
    this.msgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob,
    });

    this.msgdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.selectedMsg = -1;
        this.getInboxMessages();
      }
    });
  }
  showMsg(indx, message) {
    this.selectedMsg = indx;
    if (!message.read && this.isRecievedOrSent(message) === 'receive') {
      const consumerId = message.owner.id;
      const providerId = message.receiver.id;
      this.readConsumerMessages(consumerId, message.messageId, providerId);
    }
  }
  closeMsg() {
    this.selectedMsg = -1;
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
  showImagesection(index) {
    (this.showImages[index]) ? this.showImages[index] = false : this.showImages[index] = true;
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }

  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          console.log(this.messages);
          // this.inboxList = this.generateCustomInbox(this.messages);
          this.setMessages();
          this.loading = false;
        },
        () => {
          this.loading = false;

        }
      );
  }
  setMessages() {
    console.log(this.inboxList);
    console.log(this.selectedUser);
    console.log(this.messages)
    this.inboxList = this.generateCustomInbox(this.messages);
    console.log(this.inboxList);

    console.log(this.selectedUser.userType);


    if (this.userDet.accountType === 'BRANCH') {
      const group = this.shared_functions.groupBy(this.inboxList, 'providerName');
      Object.keys(group).forEach(key => {
        const group2 = this.shared_functions.groupBy(group[key], 'accountName');
        group[key] = group2;
      });
      console.log(group);
      this.groupedMsgsbyUser = group;


      if (this.selectedUser.userType === 'PROVIDER') {
        if (this.selectedUser.businessName) {
          this.groupedMsgs = this.groupedMsgsbyUser[this.selectedUser.businessName];
        } else {
          this.groupedMsgs = this.groupedMsgsbyUser[this.selectedUser.firstName + ' ' + this.selectedUser.lastsName];
        }
        console.log(this.groupedMsgs);
      } else {

        let arr = [];
        Object.keys(group).forEach(key => {
          let provider = key;
          const newObj = group[key];
          Object.keys(newObj).forEach(key => {
            arr[key + '=' + provider] = newObj[key];
          });
        });
        console.log(arr);
        this.groupedMsgs = arr;
        console.log(this.groupedMsgs);
      }


    } else {
      this.groupedMsgs = this.shared_functions.groupBy(this.inboxList, 'accountName');
      console.log(this.groupedMsgs)
    }


    console.log(this.selectedCustomer);
    console.log(this.selectedUserMessages);
    if (this.selectedCustomer !== '') {
      this.selectedUserMessages = this.groupedMsgs[this.selectedCustomer];
      setTimeout(() => {
        this.scrollToElement();
      }, 200);
    }
    console.log(this.selectedUserMessages);
  }
  generateCustomInbox(messages: any) {
    let inboxList = [];
    let senderName;
    let messageStatus;
    let accountId;
    let providerId;
    let providerName;
    for (const message of messages) {
      // if ((message.receiver.id === this.selectedUser.id) || (this.selectedUser.userType !== 'PROVIDER' && message.receiver.id === 0)) {
      if (this.searchUserById(message.receiver.id).length > 0 || message.receiver.id === 0) {
        accountId = message.owner.id;
        senderName = message.owner.name;
        providerId = message.receiver.id;
        if (message.receiver.id === 0) {
          providerName = message.accountName;
        } else {
          providerName = (this.searchUserById(message.receiver.id)[0].businessName) ? this.searchUserById(message.receiver.id)[0].businessName : this.searchUserById(message.receiver.id)[0].firstName + ' ' + this.searchUserById(message.receiver.id)[0].lastName;
        }
        messageStatus = 'in';
      } else if (this.searchUserById(message.owner.id).length > 0 || message.owner.id === 0) {
        accountId = message.receiver.id;
        providerId = message.owner.id;
        senderName = message.receiver.name;
        messageStatus = 'out';
        if (message.owner.id === 0) {
          providerName = message.accountName;
        } else {
          providerName = (this.searchUserById(message.owner.id)[0].businessName) ? this.searchUserById(message.owner.id)[0].businessName : this.searchUserById(message.owner.id)[0].firstName + ' ' + this.searchUserById(message.owner.id)[0].lastName;
        }
      }
      const inboxData = {
        accountId: accountId,
        timeStamp: message.timeStamp,
        accountName: senderName,
        service: message.service,
        msg: message.msg,
        providerId: providerId,
        providerName: providerName,
        waitlistId: message.waitlistId,
        messagestatus: messageStatus,
        attachements: (message.attachements) ? message.attachements : [],
        messageId: message.messageId,
        read: message.read
      };
      inboxList.push(inboxData);
    }
    return inboxList;
  }
  searchUserById(id) {
    const user = this.users.filter(user => user.id === id);
    return user;
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
  isRecievedOrSent(msg) {
    if (msg.receiver.id === 0) {
      return 'receive';
    } else if (msg.owner.id === 0) {
      return 'sent';
    } else {
      const receiverArray = this.users.filter(user => user.id === msg.receiver.id);
      const senterArray = this.users.filter(user => user.id === msg.owner.id);
      if (receiverArray.length > 0) {
        return 'receive';
      } else if (senterArray.length > 0) {
        return 'sent';
      }
    }
  }

  getUsers() {
    const filter = {};
    filter['userType-eq'] = 'PROVIDER';
    this.provider_services.getUsers(filter).subscribe(
      (data: any) => {
        this.users = data;
        this.getInboxMessages();
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/inbox']);
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/inbox']);
  }
  clearImg() {
    this.selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
  }
  getUser(user, type?) {
    // const name = user.match(/\b(\w)/g);
    if (!type) {
      user = user.split('=');
      user = user[0];
    }
    const name = user.split(' ');
    let nameShort = name[0].charAt(0);
    if (name.length > 1) {
      nameShort = nameShort + name[name.length - 1].charAt(0);
    }
    return nameShort.toUpperCase();
  }
  getUserName(user, type) {
    const name = user.split('=');
    if (type === 'customer') {
      return name[0];
    } else {
      return name[1];
    }
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  showChatSection() {
    this.showChat = !this.showChat;
  }
  scrollToElement() {
    try {
      this.scrollFrame.nativeElement.scrollTop = this.scrollFrame.nativeElement.scrollHeight;
    } catch (err) { }
  }
  onButtonBeforeHook() { }
  onButtonAfterHook() { }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  openImage(attachements, index) {
    console.log(attachements);
    console.log(index);
    this.image_list_popup_temp = this.image_list_popup = [];
    let count = 0;
    for (let comIndex = 0; comIndex < attachements.length; comIndex++) {
      const thumbPath = attachements[comIndex].thumbPath;
      let imagePath = thumbPath;
      const description = attachements[comIndex].s3path;
      const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
      if (this.imageAllowed.includes(thumbPathExt.toUpperCase())) {
        imagePath = attachements[comIndex].s3path;
      }
      const imgobj = new Image(
        count,
        { // modal
          img: imagePath,
          description: description
        },
      );
      this.image_list_popup_temp.push(imgobj);
      count++;
    }
    if (count > 0) {
      this.image_list_popup = this.image_list_popup_temp;
      console.log(this.image_list_popup);
      setTimeout(() => {
        this.openImageModalRow(this.image_list_popup[index]);
      }, 200);
    }
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
  }
  customerSelection(msgs) {
    console.log(msgs);
    this.clearImg();
    this.selectedCustomer = msgs.key;
    this.selectedUserMessages = msgs.value;
    if (this.small_device_display) {
      this.showChat = true;
    }
    const unreadMsgs = msgs.value.filter(msg => !msg.read && msg.messagestatus === 'in');
    console.log(unreadMsgs);
    if (unreadMsgs.length > 0) {
      const ids = unreadMsgs.map(msg => msg.messageId);
      const messageids = ids.toString();
      console.log(unreadMsgs[0].accountId);
      console.log(unreadMsgs[0].providerId);
      this.readConsumerMessages(unreadMsgs[0].accountId, messageids.split(',').join('-'), unreadMsgs[0].providerId);
    } else {
      setTimeout(() => {
        this.scrollToElement();
      }, 200);
    }
  }
  getUnreadCount(messages) {
    const unreadMsgs = messages.filter(msg => !msg.read && msg.messagestatus === 'in');
    return unreadMsgs.length;
  }
  sendMessage() {
    if (this.message) {
      this.sendMessageCompleted = false;
      const post_data = {
        communicationMessage: this.message
      };
      const dataToSend: FormData = new FormData();
      dataToSend.append('message', post_data.communicationMessage);
      const captions = {};
      let i = 0;
      if (this.selectedMessage) {
        for (const pic of this.selectedMessage.files) {
          dataToSend.append('attachments', pic, pic['name']);
          captions[i] = 'caption';
          i++;
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      this.shared_service.addProvidertoConsumerNote(this.selectedUserMessages[0].accountId,
        dataToSend)
        .subscribe(
          () => {
            this.message = '';
            this.getInboxMessages();
            this.clearImg();
            this.sendMessageCompleted = true;
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.sendMessageCompleted = true;
          }
        );
    }
  }
  valueOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value[a.value.length - 1]['timeStamp'] > b.value[b.value.length - 1]['timeStamp'] ? -1 : b.value[b.value.length - 1]['timeStamp'] > a.value[a.value.length - 1]['timeStamp'] ? 1 : 0;
  }
  userSelection(user) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.selectedCustomer = '';
    this.selectedUserMessages = [];
    this.setMessages();
  }
  changemsgDisplayType(type) {
    this.msgDisplay = type;
    this.selectedUser = this.userDet;
    this.selectedCustomer = '';
    this.selectedUserMessages = [];
    if (type === 'all') {
      this.setMessages();
    }
  }
  getBusinessProfileLogo(user) {
    this.provider_services.getUserBussinessProfile(user.id)
      .subscribe(
        (logodata: any) => {
          const blogo = logodata.logo;
          if (blogo[0]) {
            return (blogo[0].url) ? blogo[0].url + '?' + this.cacheavoider : '';
          } else {
            return false;
          }
        });
  }
  goBack() {
    this.selectedUser = this.userDet;
  }
}
