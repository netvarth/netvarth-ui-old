import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Messages } from "../../../../../shared/constants/project-messages";
import { ProviderServices } from "../../../../services/provider-services.service";
import { SharedFunctions } from "../../../../../shared/functions/shared-functions";
import { ConfirmBoxComponent } from "../../../../../shared/components/confirm-box/confirm-box.component";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { GroupStorageService } from "../../../../../shared/services/group-storage.service";
import { WordProcessor } from "../../../../../shared/services/word-processor.service";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { projectConstantsLocal } from "../../../../../shared/constants/project-constants";
import { ProPicPopupComponent } from "../../bprofile/pro-pic-popup/pro-pic-popup.component";
import { FileService } from "../../../../../shared/services/file-service";
import { Location } from "@angular/common";

@Component({
  selector: "app-orderitems",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
})
export class ItemsComponent implements OnInit, OnDestroy {
  tooltipcls = "";
  blogo: any = [];
  imgCaptions: any = [];
  name_cap = Messages.ITEM_NAME_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_item_cap = Messages.ADD_ITEM_CAP;
  item_enable_btn = Messages.ITEM_ENABLE_CAP;
  item_list: any = [];
  action: any = "";
  apiError = "";
  apiSuccess = "";
  fileTypeName: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: [],
  };
  query_executed = false;
  emptyMsg = "";
  coverfile: any;
  success_error1: any;
  // imageToShow = "./assets/images/crmImages/reports.png";
  imageToShow = "../../assets/images/no_image_icon.png";
  cover_url: string;
  clogo: ArrayBuffer;
  cvrimg_exists = false;
  cacheavoider_cover: string;
  @ViewChild("closebutton") closebutton;
  @ViewChild("modal") modal;
  domain;
  frm_items_cap = Messages.FRM_LEVEL_ITEMS_MSG;
  item_status = projectConstantsLocal.ITEM_STATUS;
  itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
  additemdialogRef;
  edititemdialogRef;
  statuschangedialogRef;
  removeitemdialogRef;
  notedialogRef: any;
  isCheckin;
  active_user;
  order = "status";
  items: any[];
  itemHead: { type: string };
  actions: any = [];
  isFrom;
  itemGroupDescription = "";
  itemGroupName = "";
  isDisabled = false;
  itemGroups: any[] = [];
  itemGroupId: any;
  fileName = '';
  itemGroup: any;
  selectedGroupItems: any;
  constructor(
    private provider_servicesobj: ProviderServices,
    public shared_functions: SharedFunctions,
    private router: Router,
    private dialog: MatDialog,
    private routerobj: Router,
    private activated_route: ActivatedRoute,
    private sharedfunctionObj: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private fileService: FileService,
    private groupService: GroupStorageService,
    public location: Location,
  ) {
    this.activated_route.queryParams.subscribe((qParams) => {
      this.isFrom = qParams.type;
    });
    this.emptyMsg = this.wordProcessor.getProjectMesssages("ITEM_LISTEMPTY");
  }

  ngOnInit() {
    this.itemHead = { type: "item-head" };
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.domain = user.sector;
    this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.getitems();
    this.getItemGroups();
    //  this.getItemGroupById(1);
    //this.getItemGroupPhoto();
    // this.getAllItemInGroup(this.itemGroupId);
    this.isCheckin = this.groupService.getitemFromGroupStorage("isCheckin");
  }
  ngOnDestroy() {
    if (this.additemdialogRef) {
      this.additemdialogRef.close();
    }
    if (this.edititemdialogRef) {
      this.edititemdialogRef.close();
    }
    if (this.statuschangedialogRef) {
      this.statuschangedialogRef.close();
    }
    if (this.removeitemdialogRef) {
      this.removeitemdialogRef.close();
    }
  }
  getAllItemInGroup(itemGroupId){
  // this.itemGroupId = itemGroupId;
  this.provider_servicesobj.getItemsByGroupId(itemGroupId).subscribe((res:any) => {
    console.log("items by id :", res);
   this.items = res;
  });
  }
  setFilterForApi() {
    const api_filter = {};
    // if (this.isFrom === 'all') {
    //   api_filter['completed-eq'] = false;
    // }
    if (this.itemGroupId) {
      api_filter["groupIds-eq"] = this.itemGroupId;
    }
    // else{
    //   api_filter['all-eq'] = 'all';

    // }
    return api_filter;
  }
  getItemsBygroupId() {
    let filter = {};
    filter = this.setFilterForApi();
    this.provider_servicesobj.getItemsByGroupId(filter).subscribe((res:any) => {
      console.log("items by id :", res);
     this.items = res;
    });
  }
  // Change pro pic
  changeGroupImg(image, itemGroup) {
    console.log("Imageeee :",image);
    this.notedialogRef = this.dialog.open(ProPicPopupComponent, {
      width: "50%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        //'userdata': this.bProfile,
        itemGroupId: itemGroup.itemGroupId,
        img_type: image,
        //'logoExist': (this.blogo[0]) ? true : false
      },
    });
    this.notedialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Ressss Item Image :", result);
       itemGroup = result[0];
        this.getItemGroups();
       // this.getItemGroups();
      } 
    });
  }



  deleteGroupImg(itemGroup) {
    console.log("itemsss :",itemGroup);
    this.itemGroupId = itemGroup.itemGroupId;
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: "Do you want to remove this group photo?",
      },
    });
    dialogrefd.afterClosed().subscribe((result) => {
      if (result) {
        console.log("result :",itemGroup.itemGroupImages);
        // this.provider_servicesobj.getItemGroupById(this.itemGroupId).subscribe((res:any) => {
        //   console.log("item group by id img :", res.itemGroupImages[0].keyName);
        //   this.fileName = res.itemGroupImages[0].keyName;
        // });
        const del_pic = this.fileName;
        console.log("delete img :", del_pic);
        this.provider_servicesobj
          .removeItemGroupImage(this.itemGroupId, itemGroup.itemGroupImages[0].keyName)
          .subscribe((data) => {
            // this.getItemGroupPhoto();
            console.log("Data",data);
            itemGroup.itemGroupImages = [];
            // this.getItemGroups();
            this.snackbarService.openSnackBar('Group photo deleted successfully', {
              panelClass: "snackbarnormal",
            });
          },
          (error) => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror",
            });
          }
          );
      }
    });
  }
  filesSelected(event, type?) {
    this.fileService.filesSelected(event, this.selectedMessage).then(() => {
      this.action = "attachment";
      this.modal.nativeElement.click();
    });
  }
  actionCompleted() {
    console.log("this.action");
    console.log("this.selectedMessage", this.selectedMessage.files);
    // this.apiloading = true;
    if (this.selectedMessage) {
      // const dataToSend: FormData = new FormData();
      let i = 0;
      let captions = [];
      if (this.action = "attachment" && this.selectedMessage) {
        for (const file of this.selectedMessage.files) {
          const caption = {
            fileName: file["name"],
            caption: this.imgCaptions[i] ? this.imgCaptions[i] : "",
          };
          captions.push(caption);
        }
      }

      this.provider_servicesobj
        .uploadItemGroupImage(this.itemGroupId,captions)
        .subscribe(
          (s3UrlsObj: any) => {
            // this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { panelClass: "snackbarnormal" });
            // this.selectedMessage = { files: [], base64: [], caption: [] };
            // this.getfiles();
            // this.apiloading = false;
            this.uploadFilesToS3(s3UrlsObj);
          },
          (error) => {
            this.snackbarService.openSnackBar(error.error, {
              panelClass: "snackbarerror",
            });
            // this.apiloading = false;
          }
        );
    } else {
      alert("Please attach atleast one file.");
    }
  }

  uploadFile(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_servicesobj.videoaudioS3Upload(file, url).subscribe(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }
  async uploadFilesToS3(s3Urls) {
    const _this = this;
    let count = 0;
    for (let i = 0; i < s3Urls.length; i++) {
      // this.provider_servicesobj.videoaudioS3Upload(this.selectedMessage['files'][s3Urls[i].orderId], s3Urls[i].url).subscribe(
      //   () => {

      //   // }, () => {
      //     // resolve(false);
      //   })
      // }
      await _this
        .uploadFile(
          this.selectedMessage["files"][s3Urls[i].orderId],
          s3Urls[i].url
        )
        .then(() => {
          count++;
          console.log("Count=", count);
          console.log(s3Urls.length);
          if (count === s3Urls.length) {
            _this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, {
              panelClass: "snackbarnormal",
            });
            _this.selectedMessage = { files: [], base64: [], caption: [] };
            // _this.getfiles();
            // _this.apiloading = false;
          }
        });
    }
  }
  selectAllItems(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.items.length; i++) {
        // const customer = this.selectedcustomersformsg.filter(customer => customer.id === this.customers[i].id);
        // if (customer.length === 0 && !this.showText(this.customers[i])) {
        //   this.selectedcustomersformsg.push(this.customers[i]);
        // }
        // if (this.selectedcustomersformsg.length > 1) {
        //   if (this.selectedcustomersformsg[0].phoneNo && this.selectedcustomersformsg[0].email) {
        //     this.hide_msgicon = false;
        //   }
        //   else{
        //     this.hide_msgicon = true;
        //   }
        // }
        // else {
        //   const customerList = this.selectedcustomersformsg.filter(customer => customer.phoneNo || customer.email);
        //   if (customerList.length === 0) {
        //     this.hide_msgicon = true;
        //   }
        // }
      }
    } else {
      //   for (let i = 0; i < this.customers.length; i++) {
      //     const customer = this.selectedcustomersformsg.filter(customer => customer.id === this.customers[i].id);
      //     if (customer.length > 0) {
      //       this.selectedcustomersformsg = this.selectedcustomersformsg.filter(cust => cust.id !== customer[0].id);
      //     }
      //   }
    }
  }
  isAllItemsSelected() {
    let customers = 0;
    //for (let customer of this.items) {
    //   const custArr = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    //   if (custArr.length > 0) {
    //     customers++;
    //   }
    // }
    if (customers === this.items.length) {
      return true;
    }
  }
  selectcustomers(item) {
    console.log("kjhkj :", item);
    // this.hide_msgicon = false;
    // const custArr = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    // if (custArr.length === 0) {
    //   this.selectedcustomersformsg.push(customer);
    // } else {
    //   this.selectedcustomersformsg.splice(this.selectedcustomersformsg.indexOf(customer), 1);
    // }
    // if (this.selectedcustomersformsg.length === 1) {
    //   if (!this.selectedcustomersformsg[0].phoneNo && !this.selectedcustomersformsg[0].email) {
    //     this.hide_msgicon = true;
    //   }
    // } else {
    //   const customerList = this.selectedcustomersformsg.filter(customer => customer.phoneNo || customer.email);
    //   if (customerList.length === 0) {
    //     this.hide_msgicon = true;
    //   }
    // }
    // const custArr1 = this.selectedcustomersforcall.filter(cust => cust.id === customer.id);
    // if (custArr1.length === 0) {
    //   this.selectedcustomersforcall.push(customer);
    // } else {
    //   this.selectedcustomersforcall.splice(this.selectedcustomersforcall.indexOf(customer), 1);
    // }
    // if (this.selectedcustomersformsg.length === this.customers.length) {
    //   this.allCustomerSelected = true;
    // } else {
    //   this.allCustomerSelected = false;
    // }
  }
  checkSelection(item) {
    //console.log("item :",item)
    // const custom = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    // if (custom.length > 0) {
    //   return true;
    // }
  }
  showCustomerstoAdd() {
    // this.getitems();
  }

  getItemsByGroupId(itemgroup) {
    // console.log("Filtered :",itemgroup.itemGroupId);
  }
  getItemGroups() {
    this.provider_servicesobj.getItemGroups().subscribe((data: any) => {
      console.log("list of item groups :", data);
      this.itemGroups = data;
      // for(let i=0;i<this.itemGroups.length;i++){
      //  this.itemGroupId = this.itemGroups['itemGroupId'][i];
      //  this.getAllItemInGroup(this.itemGroupId);
      // }
    });
  }

  getItemGroupById(itemGroupId) {
    this.provider_servicesobj.getItemGroupById(itemGroupId).subscribe((res) => {
      console.log("item group by id :", res);
    });
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
  }
  showimg() {
    let logourl = '';
      if (this.itemGroup.itemGroupImages[0]) {
        logourl = (this.itemGroup.itemGroupImages[0].url) ? this.itemGroup.itemGroupImages[0].url : '';
      return this.sharedfunctionObj.showlogoicon(logourl);
    }
  }   
  itemGroupAction() {
    //this.apiError = '';
    if (
      this.itemGroupName === "" ||
      (this.itemGroupName && this.itemGroupName.trim() === "")
    ) {
      this.snackbarService.openSnackBar("Please enter item group name", {
        panelClass: "snackbarerror",
      });
    } else {
      const postData = {
        groupName: this.itemGroupName,
        groupDesc: this.itemGroupDescription,
      };
      console.log("Post item Group Data :", postData);
      //   if (!this.groupEdit) {
      this.createGroup(postData);
      //   } else {
      //  postData['id'] = (this.groupIdEdit !== '') ? this.groupIdEdit : this.selectedGroup.id;
      //  this.updateGroup(postData);
      //  }
      // }
    }
  }
  createGroup(data) {
    //this.newlyCreatedGroupId = null;
    this.provider_servicesobj.addItemGroup(data).subscribe(
      (data) => {
        // this.showAddCustomerHint = true;
        //this.newlyCreatedGroupId = data;
        console.log("item group res :", data);
        this.closeGroupDialog();
        this.snackbarService.openSnackBar("created item group", {
          panelClass: "snackbarnormal",
        });
      },
      (error) => {
        // this.apiError = error.error;
        this.snackbarService.openSnackBar(error.error, {
          panelClass: "snackbarerror",
        });
      }
    );
  }
  updateGroup(data) {
    this.provider_servicesobj.updateCustomerGroup(data).subscribe(
      (data) => {
        //this.getCustomerGroup('update');
        //this.resetGroupFields();
        //this.closeGroupDialog();
      },
      (error) => {
        // this.apiError = error.error;
      }
    );
  }
  performActions(action) {
    if (action === "learnmore") {
      this.routerobj.navigate(["/provider/" + this.domain + "/billing->items"]);
    }
  }

  getitems() {
    this.items = [];
    this.provider_servicesobj.getProviderItems().subscribe((data) => {
      this.item_list = data;
      this.query_executed = true;
      const items = [];
      for (let itemIndex = 0; itemIndex < this.item_list.length; itemIndex++) {
        const actions = [];
        if (this.item_list[itemIndex].status === "ACTIVE") {
          actions.push({
            displayName: "Disable",
            action: "disable",
            iconClass: "",
          });
        } else {
          actions.push({
            displayName: "Enable",
            action: "enable",
            iconClass: "",
          });
        }
        items.push({
          type: "pitem",
          id: this.item_list[itemIndex].itemId,
          item: this.item_list[itemIndex],
          actions: actions,
        });
      }
      // }
      this.items = items;
      console.log(this.items);
    });
  }
  cardClicked(actionObj) {
    console.log("Action :", actionObj);
    if (actionObj["type"] === "pitem") {
      if (
        actionObj["action"] === "disable" ||
        actionObj["action"] === "enable"
      ) {
        this.dochangeStatus(actionObj["service"]["item"]);
      } else {
        this.editItem(actionObj["service"]["item"]);
      }
    } else {
      this.addItem();
    }
  }
  itemClicked(actionObj) {
    console.log("item clicked :", actionObj);
    if (actionObj["type"] === "pitem") {
      if (
        actionObj["actions"][0]["action"] === "disable" ||
        actionObj["actions"][0]["action"] === "enable"
      ) {
        this.dochangeStatus(actionObj["item"]);
        // console.log("Disabled :", this.dochangeStatus(actionObj['item']));
      } else {
        this.editItem(actionObj["item"]);
      }
    } else {
      this.addItem();
    }
  }
  getItemPic(img) {
    return this.sharedfunctionObj.showlogoicon(img);
  }
  addGroupItem() {
    // const navigatExtras: NavigationExtras = {
    //     queryParams: {
    //       type: this.isFrom ? this.isFrom : ''
    //     }
    //   };
    console.log("fgroup");
    this.router.navigate(["provider", "settings", "pos", "itemgroup"]);
  }

  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }
  addItem() {
    const navigatExtras: NavigationExtras = {
      queryParams: {
        type: this.isFrom ? this.isFrom : "",
      },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "items", "add"],
      navigatExtras
    );
  }
  editItem(item) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: "edit", type: this.isFrom ? this.isFrom : "" },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "items", item.itemId],
      navigationExtras
    );
  }
  editGroup(itemGroup) {
    console.log("Edit Group :", itemGroup);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: "edit",
        type: this.isFrom ? this.isFrom : "",
      },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "itemgroup", itemGroup.itemGroupId],
      navigationExtras
    );
  }
  removeItemGroup(itemGroup) {
    const id = itemGroup.itemGroupId;
    if (!id) {
      return false;
    }
    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: this.wordProcessor
          .getProjectMesssages("ITEM_DELETE")
          .replace("[name]", itemGroup.groupName),
      },
    });
    this.removeitemdialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteItemGroup(id);
      }
    });
  }
  dochangeStatus(item) {
    if (item.status === "ACTIVE") {
      this.provider_servicesobj.disableItem(item.itemId).subscribe(
        (res) => {
          this.getitems();
          console.log("Res disable :", res);
          if (res) {
            this.isDisabled = true;
          }
        },
        (error) => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror",
          });
        }
      );
    } else {
      this.provider_servicesobj.enableItem(item.itemId).subscribe(
        (res) => {
          this.getitems();
          console.log("Res enable :", res);
          if (res) {
            this.isDisabled = false;
          }
        },
        (error) => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror",
          });
        }
      );
    }
  }
  changeStatus(itemid) {
    this.provider_servicesobj.enableItem(itemid).subscribe(
      () => {
        this.getitems();
      },
      (error) => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror",
        });
      }
    );
  }

  showDetails(id) {
    if (!id) {
      return;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { action: "view" },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "items", id],
      navigationExtras
    );
  }
  editViewedItem(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: "edit" },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "items", id],
      navigationExtras
    );
  }
  goToItems() {
    const navigatExtras: NavigationExtras = {
      queryParams: {
        type: "all",
        //type: this.isFrom ? this.isFrom : ''
      },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "itemlist"],
      navigatExtras
    );
  }
  goToGroupItems(itemgroup) {
    const navigatExtras: NavigationExtras = {
      queryParams: {
        type: itemgroup.itemGroupId,
        //type: this.isFrom ? this.isFrom : ''
        name:itemgroup.groupName
      },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "itemlist"],
      navigatExtras
    );
  }
  doRemoveItem(item) {
    const id = item.itemId;
    if (!id) {
      return false;
    }
    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: this.wordProcessor
          .getProjectMesssages("ITEM_DELETE")
          .replace("[name]", item.displayName),
      },
    });
    this.removeitemdialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteItem(id);
      }
    });
  }

  deleteItem(id) {
    this.provider_servicesobj.deleteItem(id).subscribe(
      () => {
        this.getitems();
      },
      (error) => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror",
        });
      }
    );
  }
  deleteItemGroup(id) {
    this.provider_servicesobj.deleteItemGroupById(id).subscribe(
      () => {
        this.snackbarService.openSnackBar("Deleted item group successfully", {
          panelClass: "snackbarnormal",
        });
        this.getItemGroups();
      },
      (error) => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror",
        });
      }
    );
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(["/provider/" + this.domain + "/billing->" + mod]);
  }
  redirecToJaldeeBilling() {
    if (this.isFrom === "ordermanager") {
      //, "ordermanager"
      this.routerobj.navigate(["provider", "settings"]);
      // this.location.back();
    } else {
      this.routerobj.navigate(["provider", "settings", "pos"]);
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(["/provider/" + this.domain + "/billing->items"]);
  }
  stopprop(event) {
    event.stopPropagation();
  }
  getItemImg(item) {
    if (item.itemImages) {
      const img = item.itemImages.filter((image) => image.displayImage);
      if (img[0]) {
        return img[0].url;
      } else {
        return "./assets/images/order/Items.svg";
      }
    } else {
      return "./assets/images/order/Items.svg";
    }
  }
}
