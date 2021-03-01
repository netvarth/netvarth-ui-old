import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-item-list-dialog',
  templateUrl: './item-list-dialog.component.html',
  styleUrls: ['./item-list-dialog.component.css']
})
export class ItemListDialogComponent implements OnInit {

  former_chosen_items: any = [];
  item_list: any = [];
  selectedItems: any = [];

  constructor(public dialogRef: MatDialogRef<ItemListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {

  }

  ngOnInit(): void {
    this.former_chosen_items = this.data.items;
    this.getItems();

  }

  getItems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;

      });
  }
  close() {
    this.dialogRef.close();
  }
  onItemChange(event) {
    console.log(event);
  }

  onConfirm(itemObject) {
  const items = itemObject.selected.map(item => item.value);
  const result = items.map(a => a.id);
  this.dialogRef.close(result);

  }
  isSelected(item) {

    if (this.former_chosen_items.some(e => e=== item.id)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
