import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { InboxServices } from '../inbox.service';
import { KeyValue, Location } from '@angular/common';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../app.component';
import { ViewChild } from '@angular/core';
import { AdvancedLayout, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-inbox-outer',
  templateUrl: './inbox-outer.component.html',
  styleUrls: ['./inbox-outer.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class InboxOuterComponent implements OnInit {

  messages: any = [];
  breadcrumbs = [
    {
      title: 'Inbox'
    }
  ];
  selectedMsg = -1;
  userDet;
  obtainedMsgs = false;
  groupedMsgs: any = [];
  groupedMsgsCopy: any = [];
  selectedUserMessages: any = [];
  loading = false;
  message = '';
  providerName = '';
  selectedProvider = '';
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
  image_list_popup: Image[];
  image_list_popup_temp: Image[];
  imageAllowed = ['JPEG', 'JPG', 'PNG'];
  constructor(private inbox_services: InboxServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private location: Location, private snackbarService: SnackbarService,
    public shared_services: SharedServices) { }

  ngOnInit() {
    this.onResize();
    this.loading = true;
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getInboxMessages();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
    const screenHeight = window.innerHeight;
    this.userScrollHeight = screenHeight - 280;
    this.msgScrollHeight = screenHeight - 427;
  }
  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          console.log(this.messages);
          this.groupedMsgs = this.groupedMsgsCopy = this.shared_functions.groupBy(this.messages, 'accountName');
          console.log(this.groupedMsgs);
          console.log(this.selectedUserMessages);
          console.log(this.selectedProvider);
          if (this.selectedProvider !== '') {
            this.selectedUserMessages = this.groupedMsgs[this.selectedProvider];
            console.log(this.selectedUserMessages);
            setTimeout(() => {
              this.scrollToElement();
            }, 200);
          }
          this.sortMessages();
          console.log(this.groupedMsgs);
          this.obtainedMsgs = true;
          this.shared_functions.sendMessage({ 'ttype': 'load_unread_count' });
          // this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }
  goBack() {
    this.location.back();
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
  providerSelection(msgs) {
    console.log(msgs);
    this.selectedProvider = msgs.key;
    this.selectedUserMessages = msgs.value;
    if (this.small_device_display) {
      this.showChat = true;
    }
    const unreadMsgs = msgs.value.filter(msg => !msg.read && msg.owner.id !== this.userDet.id);
    console.log(unreadMsgs);
    if (unreadMsgs.length > 0) {
      const ids = unreadMsgs.map(msg => msg.messageId);
      const messageids = ids.toString();
      console.log(ids);
      this.readProviderMessages(unreadMsgs[0].owner.id, messageids.split(',').join('-'), unreadMsgs[0].accountId);
    } else {
      setTimeout(() => {
        this.scrollToElement();
      }, 200);
    }
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
      this.shared_services.addConsumertoProviderNote(this.selectedUserMessages[0].accountId,
        dataToSend)
        .subscribe(
          () => {
            this.message = '';
            this.getInboxMessages();
    this.selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
            this.sendMessageCompleted = true;
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.sendMessageCompleted = true;
          }
        );
    }
  }
  getUserName(user) {
    // const name = user.match(/\b(\w)/g);
    const name = user.split(' ');
    // console.log(user.split(' '));
    let nameShort = name[0].charAt(0);
    if (name.length > 1) {
      nameShort = nameShort + name[name.length - 1].charAt(0);
    }
    return nameShort;
  }
  searchByName() {
    console.log(this.providerName);
    this.groupedMsgs = this.groupedMsgsCopy;
    if (this.providerName !== '') {
      let arr = [];
      Object.keys(this.groupedMsgs).forEach(key => {
        if (key.search(this.providerName)) {
          console.log(key);
        } else {
          if (arr.indexOf(key) === -1) {
            arr.push(key);
          }
        }
      });
      console.log(arr);
      for (let value of arr) {
        delete this.groupedMsgs[value];
      }
    }
    console.log(this.groupedMsgs);
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
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  openImage(attachements, index) {
    this.image_list_popup_temp = this.image_list_popup = [];
    console.log(attachements);
    let count = 0;
    for (let comIndex = 0; comIndex < attachements.length; comIndex++) {
      const thumbPath = attachements[comIndex].thumbPath;
      let imagePath = thumbPath;
      const description = attachements[comIndex].s3path;
      console.log(description);
      const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
      console.log(thumbPathExt);
      if (this.imageAllowed.includes(thumbPathExt.toUpperCase())) {
        imagePath = attachements[comIndex].s3path;
      }
      console.log(imagePath);
      const imgobj = new Image(
        count,
        { // modal
          img: imagePath,
          description: description
        },
      );
      console.log(imgobj);
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
}
