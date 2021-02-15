
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import { KeyValue } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-inbox-list',
  templateUrl: './inbox-list.component.html',
  styleUrls: ['./inbox-list.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class InboxListComponent implements OnInit, OnDestroy {
  user_id;
  loading = false;
  cronHandle: Subscription;
  messages: any = [];
  users: any = [];
  inboxCntFetched;
  inboxUnreadCnt;
  groupedMsgs: any = [];
  selectedUserMessages: any = [];
  message = '';
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
  domain;
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
  provider_label = '';
  constructor(
    private inbox_services: InboxServices,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    private groupService: GroupStorageService,
    public wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private router: Router) { }
  ngOnInit() {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    const cnow = new Date();
    const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
    this.cacheavoider = dd;
    this.userDet = this.selectedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = this.userDet.sector;
    this.businesDetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (this.userDet.accountType === 'BRANCH') {
      this.getUsers();
    } else {
      this.getInboxMessages();
    }
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
  }
  readConsumerMessages(consumerId, messageId, providerId) {
    this.provider_services.readConsumerMessages(consumerId, messageId, providerId).subscribe(data => {
      this.getInboxUnreadCnt();
      this.getInboxMessages();
    }, error => {
      setTimeout(() => {
        this.scrollToElement();
      }, 100);
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
      }, 100);
    }
    console.log(this.selectedUserMessages);
  }
  getImage(url, file) {
    if (file.type == 'application/pdf') {
      return '../../../assets/images/pdf.png';
    } else {
      return url;
    }
  }
  generateCustomInbox(messages: any) {
    let inboxList = [];
    let senderName;
    let messageStatus;
    let accountId;
    let providerId;
    let providerName;
    for (const message of messages) {
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
  redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/inbox']);
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
  clearImg() {
    this.selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
  }
  getUser(user, type?) {
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
      }, 100);
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
  getUserImg() {
    return '../../../assets/images/avatar5.png';
  }
}
