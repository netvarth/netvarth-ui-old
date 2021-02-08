import { Component, HostListener, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { InboxServices } from '../inbox.service';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../app.component';

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
  showChat = true;
  screenWidth;
  small_device_display = false;
  constructor(private inbox_services: InboxServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private location: Location, private snackbarService: SnackbarService,
    public shared_services: SharedServices) { }

  ngOnInit() {
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
  }
  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;


          console.log(this.messages);
          this.groupedMsgs = this.shared_functions.groupBy(this.messages, 'accountName');
          console.log(this.groupedMsgs);

          console.log(this.selectedUserMessages);
          console.log(this.selectedProvider);
          if (this.selectedProvider !== '') {
            this.selectedUserMessages = this.groupedMsgs[this.selectedProvider];
            console.log(this.selectedUserMessages);
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
    this.showChat = false;
    }
    const unreadMsgs = msgs.value.filter(msg => !msg.read && msg.owner.id !== this.userDet.id);
    console.log(unreadMsgs);
    if (unreadMsgs.length > 0) {
      const ids = unreadMsgs.map(msg => msg.messageId);
      const messageids = ids.toString();
      console.log(ids);
      this.readProviderMessages(unreadMsgs[0].owner.id, messageids.split(',').join('-'), unreadMsgs[0].accountId);
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
  //   orderClause = (a: KeyValue<number,[string]>, b: KeyValue<number,[string]>): number => {
  //     console.log(a);
  //   return a.value[a.value.length-1].length > b.value[b.value.length-1].length ? -1 : (a.value[a.value.length-1].length > b.value[b.value.length-1].length) ? 0 : 1  
  // }
  // trackByFn(index, item) {
  //   console.log(item);
  //   return item.value; 
  // }
  sendMessage() {
    if (this.message) {
      const post_data = {
        communicationMessage: this.message
      };

      const dataToSend: FormData = new FormData();
      dataToSend.append('communicationMessage', this.message);
      const captions = {};
      let i = 0;
      if (this.selectedMessage) {
        for (const pic of this.selectedMessage.files) {
          dataToSend.append('attachementStream', pic, pic['name']);
          captions[i] = 'caption';
          i++;
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      
      this.shared_services.addConsumertoProviderNote(this.selectedUserMessages[0].accountId,
        post_data)
        .subscribe(
          () => {
            this.message = '';
            this.getInboxMessages();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
  getUserName(user) {
    const name = user.match(/\b(\w)/g);
    let nameShort = name[0];
    if (name.length > 1) {
      nameShort = nameShort + name[name.length-1];
    }
    // console.log(nameShort);
    return nameShort;
  }
  searchByName() {
    console.log(this.providerName);
    const arr = this.groupedMsgs.filter(value => value.key === this.providerName);
    console.log(arr);
    Object.keys(this.groupedMsgs).forEach(key => {
      if (key.includes(this.providerName)) {
        console.log(key);
      }
    });
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
}
