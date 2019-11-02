/// <reference types="@types/googlemaps" />
import { Component, Inject, OnInit, NgZone, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ViewChild } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedServices } from '../../../shared/services/shared-services';
// import { } from 'googlemaps';

@Component({
  selector: 'app-google-map',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  choose_location_cap = Messages.LOCATION_MAP_CAP;
  mark_map_cap = Messages.MARK_MAP_CAP;
  select_address_cap = Messages.SELECT_ADDRESS_CAP;
  yes_done_cap = Messages.YES_DONE_CAP;
  map: google.maps.Map;
  lat_lng = {
    latitude: 12.9715987,
    longitude: 77.5945627
  };
  marker;
  obtained_address = '';
  obtained_pin = '';
  mapaddress;
  show_search = true;
  locationName;

  constructor(
    public dialogRef: MatDialogRef<GoogleMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private _ngZone: NgZone, public shared_service: SharedServices
  ) {
    if (data.passloc.lat !== '' && data.passloc.lon !== '') {
      this.lat_lng.latitude = parseFloat(data.passloc.lat);
      this.lat_lng.longitude = parseFloat(data.passloc.lon);
    }
  }

  ngOnInit() {
    // if ((this.data.passloc.lat === '' && this.data.passloc.lon === '') || (this.data.passloc.lat === undefined && this.data.passloc.lon === undefined)) {
    if (this.data.passloc.lat && this.data.passloc.lon) {
      this.setLocationtoMap();
      this.getAddressonDragorClick('edit');
    } else {
      this.getCurrentLocation();
    }
  }
  getAddressonDragorClick(action?) {
    this.show_search = true;
    this.mapaddress = [];
    if (!action) {
      this.getAddressfromLatLong();
    }
    const getLatLng = (e) => {
      try {
        this._ngZone.run(() => {
          this.lat_lng.latitude = e.latLng.lat();
          this.lat_lng.longitude = e.latLng.lng();
          this.placeMarker(e.latLng, this.map);
          this.obtained_address = '';
          this.obtained_pin = '';
          this.mapaddress = [];
          this.getAddressfromLatLong();
        });
      } catch (error) {

      }
    };
    this.marker.addListener('dragend', getLatLng.bind(this));
    this.map.addListener('click', getLatLng.bind(this));
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    });
    // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchElementRef.nativeElement);
    // setTimeout(
    //   () => {
    //     this.show_search = true;
    //   }, 1000
    // );
    autocomplete.addListener('place_changed', () => {
      this._ngZone.run(() => {
        // get the place result
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.map.setCenter(place.geometry.location);
        this.placeMarker(place.geometry.location, this.map);
        const ob = { latLng: place.geometry.location };
        getLatLng(ob);
      });
    });
  }
  getAddress() {
    this.provider_services.getGoogleMapLocationAddress(this.lat_lng.latitude, this.lat_lng.longitude)
      .subscribe(mapdata => {
        let map_address = '';
        let map_pin = '';
        // this.obtained_address = '';
        if (mapdata['status'] === 'OK') {
          if (mapdata['results']) {
            const maxcnt = 3;
            for (let i = 0; i < mapdata['results'].length; i++) {
              if (i < maxcnt) {
                let formataddress = '';
                if (mapdata['results'][i].formatted_address) {
                  formataddress = mapdata['results'][i].formatted_address;
                }
                let curpin = '';
                if (mapdata['results'][0]['address_components'][8]) {
                  curpin = mapdata['results'][0]['address_components'][8]['long_name'];
                }
                this.mapaddress.push({ 'address': formataddress, 'pin': curpin });
              }
            }
            if (mapdata['results'][0]) {
              if (mapdata['results'][0] !== undefined) {
                map_address = mapdata['results'][0].formatted_address;
              }
              if (mapdata['results'][0]['address_components'][8] !== undefined) {
                map_pin = mapdata['results'][0]['address_components'][8]['long_name'] || '';
              }
            }
          }
        }
        // this.obtained_address = map_address;
        this.obtained_pin = map_pin;
      });
  }
  placeMarker(location, map) {
    if (this.marker) {
      this.marker.setPosition(location);
    } else {
      this.marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true
      });
    }
  }
  mapselectionDone() {
    const retvalues = {
      'map_point': this.lat_lng,
      'status': 'selectedonmap',
      'address': this.obtained_address,
      'location': this.locationName
    };
    this.dialogRef.close(retvalues);
  }
  mapaddress_change(addressR) {
    this.obtained_address = addressR.address;
    this.obtained_pin = addressR.pin;
    // this.mapselectionDone();
  }
  getCurrentLocation() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lat_lng.longitude = +pos.coords.longitude;
        this.lat_lng.latitude = +pos.coords.latitude;
        this.setLocationtoMap();
        this.getAddressonDragorClick();
      },
        error => {

        });
    }
  }
  setLocationtoMap() {
    const mapProp = {
      center: new google.maps.LatLng(this.lat_lng.latitude, this.lat_lng.longitude),
      zoom: projectConstants.MAP_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false
    };
    const center = { lat: this.lat_lng.latitude, lng: this.lat_lng.longitude };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      draggable: true
    });
  }
  getAddressfromLatLong() {
    this.shared_service.getAddressfromLatLong(this.lat_lng).subscribe(data => {
      const currentAddress = this.shared_service.getFormattedAddress(data);
      this.mapaddress.push({ 'address': currentAddress, 'pin': data['pinCode'] });
      this.locationName = data['area'];
      this.mapaddress_change(this.mapaddress[0]);
      this.getAddress();
    });
  }
}

