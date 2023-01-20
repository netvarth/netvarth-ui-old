import { Component, OnInit, ViewChild } from "@angular/core";
import { ProviderServices } from "../../../../services/provider-services.service";
import { SharedFunctions } from "../../../../../shared/functions/shared-functions";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Location } from "@angular/common";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { ConfirmBoxComponent } from "../../../../../shared/components/confirm-box/confirm-box.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-itemlist",
  templateUrl: "./itemlist.component.html",
  styleUrls: ["./itemlist.component.css"],
})
export class ItemlistComponent implements OnInit {
  isFrom;
  items: any[];
  groupitems:any=[];
  newItems:any[];
  item_list: any = [];
  itemGroupId: any;
  itemGroupDescription = "";
  itemGroupName = "";
  isDisabled = false;
  itemGroups: any[] = [];
  @ViewChild("closebutton") closebutton;
  selecteditemsforgroup: any = [];
  allGroupItemsSelected = false;
  selectedGroup;
  groupCustomers;
  showCustomers = false;
  item: any;
  selectedGroupItems: any;
  groupName = '';

  constructor(
    private provider_servicesobj: ProviderServices,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    public location: Location,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {
    this.activated_route.queryParams.subscribe((qParams) => {
      this.isFrom = qParams.type;
      this.groupName = qParams.name;
      if (this.isFrom === "all") {
        this.getitems();
      } else {
        this.itemGroupId = qParams.type;
        console.log("item group id :", this.itemGroupId);
        this.getItemsBygroupId();
        // this.getitemsByFiltered();
      }
    });
  }

  ngOnInit(): void {}

  redirecTo() {
    if (this.isFrom === "all") {
      const navigatExtras: NavigationExtras = {
        queryParams: {
          type: "ordermanager",
        },
      };
      this.router.navigate(
        ["provider", "settings", "pos", "items"],
        navigatExtras
      );
    } else {
      this.location.back();
    }
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
    console.log("getItemsBygroupId");
    let filter = {};
    filter = this.setFilterForApi();
    console.log("filter", filter);

    this.provider_servicesobj.getItemsByGroupId(filter).subscribe((res:any) => {
      console.log("items by id :", res);
      this.items = res;
      this.selectedGroupItems = this.items;
     console.log("items",  this.items);

    });
  }
  getAllItemById(){
   // this.getitems();
  }
  getitemsByFiltered(){
    let currentArray:any=[];
    this.groupitems = [];
    this.provider_servicesobj.getProviderItems().subscribe((data :any) => {
       currentArray = data;
       console.log('currentArray:;-',currentArray);
       this.getFilteredItem(currentArray);
    });
  }
  getFilteredItem(currentArray){
    this.groupitems = [];
    console.log('selectedGroupItems:;-',this.selectedGroupItems)
      // currentArray = currentArray.filter(val => !this.selectedGroupItems.includes(val));
      for( var i=currentArray.length - 1; i>=0; i--){
        for( var j=0; j<this.selectedGroupItems.length; j++){
            if(currentArray[i] && (currentArray[i].itemId === this.selectedGroupItems[j].itemId)){
              currentArray.splice(i, 1);
            }
        }
    }
      //alert(JSON.stringify(currentArray));
      this.groupitems = currentArray;
      
      console.log("currentArray ",this.groupitems);
  }

  getitems() {
    this.items = [];
    this.provider_servicesobj.getProviderItems().subscribe((data :any) => {
      this.item_list = data;
      // this.query_executed = true;
      //getProviderfilterItems
      // const items = [];
      // for (let itemIndex = 0; itemIndex < this.item_list.length; itemIndex++) {
      //   const actions = [];
      //   if (this.item_list[itemIndex].status === "ACTIVE") {
      //     actions.push({
      //       displayName: "Disable",
      //       action: "disable",
      //       iconClass: "",
      //     });
      //   } else {
      //     actions.push({
      //       displayName: "Enable",
      //       action: "enable",
      //       iconClass: "",
      //     });
      //   }
      //   items.push({
      //     type: "pitem",
      //     id: this.item_list[itemIndex].itemId,
      //     item: this.item_list[itemIndex],
      //     actions: actions,
      //   });
      // }
      // }
      this.items = data;
      console.log("list data :",this.items);
    });
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

  editItem(item) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: "edit", type: this.isFrom ? this.isFrom : "" },
    };
    this.router.navigate(
      ["provider", "settings", "pos", "items", item.itemId],
      navigationExtras
    );
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
        // this.editItem(actionObj['item']);
      }
    } else {
      // this.addItem();
    }
  }
  itemStatusChange(item) {
    console.log("Item selected :",item);
    let status = '';
    if(item.status === 'ACTIVE'){
      status = 'disable'
    }
    if(item.status === 'INACTIVE'){
      status = 'enable'
    }
    const itemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: `Are you sure you want to ${status}?`,
        type: "yes/no",
      },
    });
    itemdialogRef.afterClosed().subscribe((result) => {
      if (result) {
      this.dochangeStatus(item);
      }
    });
  }
  dochangeStatus(item) {
    if (item.status === "ACTIVE") {
      this.provider_servicesobj.disableItem(item.itemId).subscribe(
        (res) => {
          console.log("Res disable :", res);
          if (res) {
            // this.isDisabled = true;
          }
          if(this.itemGroupId){
            this.getItemsBygroupId();
          const navigatExtras: NavigationExtras = {
            queryParams: {
              type: this.itemGroupId,
              //type: this.isFrom ? this.isFrom : ''
            },
          };
          this.router.navigate(
            ["provider", "settings", "pos", "itemlist"],
            navigatExtras
          );
          }
          else{
            this.getitems();
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
          console.log("Res enable :", res);
          if (res) {
            // this.isDisabled = false;
          }
            if(this.itemGroupId){
              this.getItemsBygroupId();
          const navigatExtras: NavigationExtras = {
            queryParams: {
              type: this.itemGroupId,
              //type: this.isFrom ? this.isFrom : ''
            },
          };
          this.router.navigate(
            ["provider", "settings", "pos", "itemlist"],
            navigatExtras
          );
          }
          else{
            this.getitems();
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

  isAllItemsSelected() {
    let items = 0;
    for (let item of this.groupitems) {
      const custArr = this.selecteditemsforgroup.filter(
        (cust) => cust.itemId === item.itemId
      );
      if (custArr.length > 0) {
        items++;
      }
    }
    if (items === this.groupitems.length) {
      return true;
    }
    if(this.groupitems && this.groupitems.length === 0){
      return false;
    }
  }
  selectAllItems(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.groupitems.length; i++) {
        const customer = this.selecteditemsforgroup.filter(
          (customer) => customer.itemId === this.groupitems[i].itemId
        );
        if (customer.length === 0) {
          this.selecteditemsforgroup.push(this.groupitems[i]);
        }
        if (this.selecteditemsforgroup.length > 1) {
          // this.selecteditemsforgroup.push(this.items[i]);
          console.log("selected items :", this.selecteditemsforgroup);
          // if (
          //   this.selecteditemsforgroup[0].phoneNo &&
          //   this.selecteditemsforgroup[0].email
          // ) {
          //   this.hide_msgicon = false;
          // } else {
          //   this.hide_msgicon = true;
          // }
        }
        // else {
        //   const customerList = this.selectedcustomersformsg.filter(customer => customer.phoneNo || customer.email);
        //   if (customerList.length === 0) {
        //     this.hide_msgicon = true;
        //   }
        // }
      }
    } else {
      for (let i = 0; i < this.groupitems.length; i++) {
        const item = this.selecteditemsforgroup.filter(
          (customer) => customer.itemId === this.groupitems[i].itemId
        );
        if (item.length > 0) {
          this.selecteditemsforgroup = this.selecteditemsforgroup.filter(
            (cust) => cust.itemId !== item[0].itemId
          );
        }
      }
    }
  }
  showText(item) {
    if (this.selectedGroup !== "all" && this.showCustomers) {
      const fitlerArray = this.groupCustomers.filter(
        (custom) => custom.id === item.itemId
      );
      if (fitlerArray[0]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  selectItems(item) {
    console.log("items :", item);
    this.item = item;
    // this.hide_msgicon = false;
    const custArr = this.selecteditemsforgroup.filter(
      (cust) =>cust.itemId === item.itemId
    );
    if (custArr.length === 0) {
      this.selecteditemsforgroup.push(item);
    } else {
      this.selecteditemsforgroup.splice(
        this.selecteditemsforgroup.indexOf(item),
        1
      );
    }
    if (this.selecteditemsforgroup.length === this.groupitems.length) {
      this.allGroupItemsSelected = true;
    } else {
      this.allGroupItemsSelected = false;
    }
  }
  stopprop(event) {
    event.stopPropagation();
  }

  checkSelection(item) {
    // console.log("item :",item)
    const custom = this.selecteditemsforgroup.filter(
      (cust) => cust.itemId === item.itemId
    );
    if (custom.length > 0) {
      return true;
    }
  }
  showCustomerstoAdd() {
    // this.getitems();
  }

  addItemToItemGroup(itemId?) {
    const ids = [];
    if (itemId) {
      ids.push(itemId);
    } else {
      for (let item of this.selecteditemsforgroup) {
        ids.push(item.itemId);
      }
    }
   // const expiryDate = this.convertDate(this.item.item.expiryDate);
    // const postData = {
    //   // 'groupName': this.selectedGroup.groupName,
    //   // 'providerConsumerIds':ids
    //   // "itemCode": this.item.item.itemCode || '',
    //   // "itemNameInLocal": this.item.item.itemNameInLocal || '',
    //   // "itemName": this.item.item.itemName || '',
    //   // "displayName": this.item.item.displayName || '',
    //   // "shortDesc": this.item.item.shortDesc || '',
    //   // "itemDesc": this.item.item.itemDesc || '',
    //   // "itemType":this.item.item.itemType || '',
    //   // "expiryDate": expiryDate || '',
    //   // "note": this.item.item.note || '',
    //   // "taxable": this.item.item.taxable || false,
    //   // "price": this.item.item.price || '',
    //   // "showPromotionalPrice": this.item.item.showPromotionalPrice || false,
    //   // "isShowOnLandingpage": this.item.item.isShowOnLandingpage || true,
    //   // "isStockAvailable": this.item.item.isStockAvailable || true,
    //   // "promotionalPriceType": this.item.item.promotionalPriceType || "NONE",
    //   // "promotionLabelType": this.item.item.promotionLabelType || "NONE",
    //   // "promotionLabel": this.item.item.promotionLabel || '',
    //   // "promotionalPrice": this.item.item.promotionalPrice || 0,
    //   // "promotionalPrcnt": this.item.item.promotionalPrcnt || 0,
    //   // "groupIds": ids,
    //   ids

    // };
    console.log("posting data :", ids);
    this.provider_servicesobj.addItemsToGroupById(this.itemGroupId,ids).subscribe(
      (data: any) => {
        console.log("data :", data);
        this.items = data;
        this.snackbarService.openSnackBar(`Added ${this.selecteditemsforgroup.length} items to the group ${this.itemGroupId}`, {
          panelClass: "snackbarnormal",
        });
        this.getItemsBygroupId();
        this.closeGroupDialog();
        // this.showCustomers = false;
        // this.resetList();
        // this.getCustomerListByGroup();
        const navigatExtras: NavigationExtras = {
          queryParams: {
            type: this.itemGroupId,
            //type: this.isFrom ? this.isFrom : ''
            name:this.groupName
          },
        };
        this.router.navigate(
          ["provider", "settings", "pos", "itemlist"],
          navigatExtras
        );
      },
      (error) => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror",
        });
      }
    );
  }
  removeCustomerFromGroup(item?) {
    const ids = [];
    let items = [];
    if (items) {
      items.push(item);
    } else {
      items = this.selecteditemsforgroup;
    }
    for (let item of items) {
      ids.push(item.itemId);
    }
    const removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: "Are you sure you want to remove?",
        type: "yes/no",
      },
    });
    removeitemdialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.provider_services.removeCustomerFromGroup(this.selectedGroup.groupName, ids).subscribe(
        //   (data: any) => {
        //     this.showCustomers = false;
        //     //this.resetList();
        //     //this.getCustomerListByGroup();
        //   },
        //   error => {
        //     this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //   });
      }
    });
  }
//   convertDate(date?) {
//     // let today;
//     let mon;
//     let cdate;
//     if (date) {
//         cdate = new Date(date);
//     } else {
//         cdate = new Date();
//     }
//     mon = (cdate.getMonth() + 1);
//     if (mon < 10) {
//         mon = '0' + mon;
//     }
//     return (cdate.getFullYear() + '-' + mon + '-' + ('0' + cdate.getDate()).slice(-2));
// }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
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
}
