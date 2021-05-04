import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-item-list-dialog',
  templateUrl: './item-list-dialog.component.html',
  styleUrls: ['./item-list-dialog.component.css']
})
export class ItemListDialogComponent implements OnInit,OnDestroy {

  former_chosen_items: any = [];
  item_list: any = [];
  selectedItems: any = [];
  loading=true;
  subscription:Subscription;
  mode: any;
  constructor(public dialogRef: MatDialogRef<ItemListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {
    this.mode=this.data.mode;
  }

  ngOnInit(): void {
    this.former_chosen_items = this.data.items;
    this.getItems();

  }

  getItems() {
  this.subscription=  this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.loading=false;

      },
      error => {
        this.loading = false;
     });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onItemChange(event) {
    console.log(event);
  }

  onConfirm(itemObject) {
  const items = itemObject.selected.map(item => item.value);
  const result = items.map(a => a.itemId);
  this.dialogRef.close(result);

  }
  isSelected(item) {

    if (this.former_chosen_items.some(e => e === item.itemId)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
