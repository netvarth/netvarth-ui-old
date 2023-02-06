import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdlService } from '../cdl.service';

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.css']
})
export class GmapsComponent implements OnInit {
  options: any;
map: google.maps.Map;
  overlays: google.maps.Marker[];
  selectedPosition: any;
  latitude: any = 10.5276;
  longitude: any = 76.2144;
  address: any;
  title: any = "Select Location";
  mapaddress: any = [];
  pin: string;

  constructor(
    public dialogRef: MatDialogRef<GmapsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdlService: CdlService
  ) {
    if (data && data.title) {
      this.title = data.title;
    }
    if (data && data.latitude) {
      this.latitude = data.latitude;
    }
    if (data && data.longitude) {
      this.longitude = data.longitude;
    }
    if (data && data.address) {
      this.address = data.address;
    }
  }

  ngOnInit(): void {

    this.overlays = [
      new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        title: "Thrissur",
        draggable: true
      })
    ];

    this.options = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 12
    };

  }

  close() {
    this.dialogRef.close()
  }

  closeWithData() {
    let data = {
      'latitude': this.latitude,
      'longitude': this.longitude,
      'address': this.address
    }
    this.dialogRef.close(data)
  }

  handleMapClick(event) {
    console.log(event)
    this.selectedPosition = event.latLng;
    this.overlays = [
      new google.maps.Marker({
        position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() },
        draggable: true
      })
    ];
    this.latitude = this.selectedPosition.lat();
    this.longitude = this.selectedPosition.lng();
    this.getGoogleLocationAddress(this.latitude, this.longitude)
    console.log({ lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() })
  }


  handleOverlayDrag(event) {
    console.log(event)
    this.selectedPosition = event.originalEvent.latLng;
    this.overlays = [
      new google.maps.Marker({
        position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() },
        draggable: true
      })
    ];
    this.latitude = this.selectedPosition.lat();
    this.longitude = this.selectedPosition.lng();
    this.getGoogleLocationAddress(this.latitude, this.longitude)
    console.log({ lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() })
  }


  getGoogleLocationAddress(latitude, longitude) {
    this.cdlService.getGoogleMapLocationAddress(latitude, longitude).subscribe((data: any) => {
      let map_address = '';
      let map_pin = '';
      if (data['status'] === 'OK') {
        if (data['results']) {
          const maxcnt = 3;
          for (let i = 0; i < data['results'].length; i++) {
            if (i < maxcnt) {
              let formataddress = '';
              if (data['results'][i].formatted_address) {
                formataddress = data['results'][i].formatted_address;
              }
              let curpin = '';
              if (data['results'][0]['address_components'][8]) {
                curpin = data['results'][0]['address_components'][8]['long_name'];
              }
              this.mapaddress.push({ 'address': formataddress, 'pin': curpin });
            }
          }
          if (data['results'][0]) {
            if (data['results'][0] !== undefined) {
              map_address = data['results'][0].formatted_address;
            }
            if (data['results'][0]['address_components'][8] !== undefined) {
              map_pin = data['results'][0]['address_components'][8]['long_name'] || '';
            }
          }
        }
      }
      this.address = map_address;
      this.pin = map_pin;
      console.log(this.address, this.pin)
    })
  }

}
