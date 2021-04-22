import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { InboxServices } from '../inbox.service';
import { KeyValue, Location } from '@angular/common';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../app.component';
import { ViewChild } from '@angular/core';
import { AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { interval as observableInterval, Subscription } from 'rxjs';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
  selector: 'app-inbox-outer',
  templateUrl: './inbox-outer.component.html',
  styleUrls: ['./inbox-outer.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class InboxOuterComponent implements OnInit {

  messages: any = [];
  userDet;
  groupedMsgs: any = [];
  selectedUserMessages: any = [];
  loading = false;
  message = '';
  selectedProvider = '';
  selectedProviderName = '';
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  showChat = false;
  screenWidth;
  small_device_display = false;
  sendMessageCompleted = true;
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
  scrollDone = false;
  cronHandle: Subscription;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  replyMsg;
  msgTypes = projectConstantsLocal.INBOX_MSG_TYPES;
  @ViewChildren('outmsgId') outmsgIds: QueryList<ElementRef>;
  @ViewChildren('inmsgId') inmsgId: QueryList<ElementRef>;
  constructor(private inbox_services: InboxServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private location: Location, private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private dateTimeProcessor: DateTimeProcessor) { }
  ngOnInit() {
    this.onResize();
    this.loading = true;
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getInboxMessages();
    this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
      this.getInboxMessages();
    });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 600) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          this.scrollDone = true;
          this.sortMessages();
          this.groupedMsgs = this.shared_functions.groupBy(this.messages, 'accountId');
          if (this.selectedProvider !== '') {
            this.selectedUserMessages = this.groupedMsgs[this.selectedProvider];
            const unreadMsgs = this.selectedUserMessages.filter(msg => !msg.read && msg.owner.id !== this.userDet.id);
            if (unreadMsgs.length > 0) {
              const ids = unreadMsgs.map(msg => msg.messageId);
              const messageids = ids.toString();
              this.readProviderMessages(unreadMsgs[0].owner.id, messageids.split(',').join('-'), unreadMsgs[0].accountId);
            }
            setTimeout(() => {
              this.scrollToElement();
            }, 100);
          }
          this.shared_functions.sendMessage({ 'ttype': 'load_unread_count' });
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }
  goBack() {
    if (this.small_device_display && this.showChat) {
      this.showChat = false;
    } else {
      this.location.back();
    }
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
  valueOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value[a.value.length - 1]['timeStamp'] > b.value[b.value.length - 1]['timeStamp'] ? -1 : b.value[b.value.length - 1]['timeStamp'] > a.value[a.value.length - 1]['timeStamp'] ? 1 : 0;
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
  providerSelection(msgs) {
    this.clearImg();
    this.message = '';
    this.selectedProvider = msgs.key;
    this.selectedProviderName = msgs.value[(msgs.value.length - 1)].accountName;
    this.replyMsg = null;
    this.selectedUserMessages = msgs.value;
    if (this.small_device_display) {
      this.showChat = true;
    }
    const unreadMsgs = msgs.value.filter(msg => !msg.read && msg.owner.id !== this.userDet.id);
    if (unreadMsgs.length > 0) {
      const ids = unreadMsgs.map(msg => msg.messageId);
      const messageids = ids.toString();
      this.readProviderMessages(unreadMsgs[0].owner.id, messageids.split(',').join('-'), unreadMsgs[0].accountId);
    }
    setTimeout(() => {
      this.scrollToElement();
    }, 100);
  }
  getUnreadCount(messages) {
    const unreadMsgs = messages.filter(msg => !msg.read && msg.owner.id !== this.userDet.id);
    return unreadMsgs.length;
  }
  readProviderMessages(providerId, messageId, accountId) {
    this.inbox_services.readProviderMessages(providerId, messageId, accountId).subscribe(data => {
      this.getInboxMessages();
    });
  }
  sendMessage() {
    if (this.message) {
      this.sendMessageCompleted = false;
      const post_data = {
        communicationMessage: this.message
      };
      const dataToSend: FormData = new FormData();
      post_data['msg'] = post_data.communicationMessage;
      post_data['messageType'] = 'CHAT';
      if (this.replyMsg) {
        post_data['replyMessageId'] = this.replyMsg.messageId;
      }
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
      const blobpost_Data = new Blob([JSON.stringify(post_data)], { type: 'application/json' });
      dataToSend.append('message', blobpost_Data);
      const filter = { 'account': this.selectedUserMessages[0].accountId };
      this.shared_services.addConsumertoProviderNote(dataToSend, filter)
        .subscribe(
          () => {
            this.message = '';
            this.scrollDone = false;
            this.replyMsg = null;
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
  clearImg() {
    this.selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
  }
  getUserName(messages) {
    let user = messages[(messages.length - 1)].accountName;
    if (user) {
      const userPattern = new RegExp(/^[ A-Za-z0-9_.'-]*$/);
      const name = user.split(' ');
      const pattern = userPattern.test(name[0]);
      let nameShort = name[0].charAt(0);
      if (name.length > 1 && pattern) {
        nameShort = nameShort + name[name.length - 1].charAt(0);
      }
      return nameShort.toUpperCase();
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
  getImage(url, file) {
    if (file.type == 'application/pdf') {
      return '../../../../assets/images/pdf.png';
    } else {
      return url;
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
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
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
        {
          img: imagePath
        },
      );
      this.image_list_popup_temp.push(imgobj);
      count++;
    }
    if (count > 0) {
      this.image_list_popup = this.image_list_popup_temp;
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
  replytoMsg(msg) {
    this.replyMsg = msg;
  }
  closeReply() {
    this.replyMsg = null;
  }
  getReplyMsgbyId(msgId) {
    const replyMsg = this.messages.filter(msg => msg.messageId === msgId);
    return replyMsg[0];
  }
  gotoReplyMsgSection(msgId) {
    let msgs;
    if (this.getReplyMsgbyId(msgId).owner.id !== this.userDet.id) {
      msgs = this.outmsgIds;
    } else {
      msgs = this.inmsgId;
    }
    msgs.toArray().forEach(element => {
      if (element.nativeElement.innerHTML.trim() === this.getReplyMsgbyId(msgId).msg.trim()) {
        const a = document.getElementsByClassName('selmsg');
        const b = document.getElementsByClassName('messages');
        for (let i = 0; i < a.length; i++) {
          if (a[i].innerHTML.trim() === this.getReplyMsgbyId(msgId).msg.trim()) {
            b[i].classList.add('blinkelem');
          }
        }
        element.nativeElement.scrollIntoViewIfNeeded();
        return false;
      }
    });
    setTimeout(() => {
      const b = document.getElementsByClassName('messages');
      for (let i = 0; i < b.length; i++) {
        b[i].classList.remove('blinkelem');
      }
    }, 2000);
  }
  getMsgType(msg) {
    if (msg.messageType) {
      return this.msgTypes[msg.messageType];
    }
  }
}
