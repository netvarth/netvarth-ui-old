import { Component, Inject, OnInit, NgZone, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-google-map',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  map: google.maps.Map;
  lat_lng = {
    latitude: 12.9715987,
    longitude: 77.5945627
  };
  marker;
  obtained_address = '';
  obtained_pin = '';
  mapaddress: any = [];
  constructor(
    public dialogRef: MatDialogRef<GoogleMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private _ngZone: NgZone
    ) {
       if (data.passloc.lat !== '' && data.passloc.lon !== '') {
        this.lat_lng.latitude = parseFloat(data.passloc.lat);
        this.lat_lng.longitude = parseFloat(data.passloc.lon);
       }
     }
     ngOnInit() {
      if (!this.lat_lng.latitude || !this.lat_lng.longitude) {
        const localloc = this.sharedfunctionObj.getitemfromLocalStorage('ynw-locdet');
        if (localloc) {
          if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
              this.lat_lng.latitude = parseFloat(localloc.lat);
              this.lat_lng.longitude = parseFloat(localloc.lon);
          } else { // case if details are not there in the local storage
              this.lat_lng.latitude = parseFloat(projectConstants.SEARCH_DEFAULT_LOCATION.lat);
              this.lat_lng.longitude = parseFloat(projectConstants.SEARCH_DEFAULT_LOCATION.lon);
          }
        } else {
            this.lat_lng.latitude = parseFloat(projectConstants.SEARCH_DEFAULT_LOCATION.lat);
            this.lat_lng.longitude = parseFloat(projectConstants.SEARCH_DEFAULT_LOCATION.lon);
        }



    }


      const mapProp = {
        center: new google.maps.LatLng( this.lat_lng.latitude, this.lat_lng.longitude),
        zoom: projectConstants.MAP_ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      const center = {lat: this.lat_lng.latitude, lng: this.lat_lng.longitude};
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      this.marker = new google.maps.Marker({
        position: center,
        map: this.map,
        draggable: true
      });
      // const ob = this;

      const getLatLng = (e) => {
        try {
          this._ngZone.run(() => { // console.log(e);
            this.lat_lng.latitude = e.latLng.lat();
            this.lat_lng.longitude = e.latLng.lng();
            this.placeMarker(e.latLng, this.map);
            this.obtained_address = '';
            this.obtained_pin = '';
            this.mapaddress = [];
            this.provider_services.getGoogleMapLocationAddress(this.lat_lng.latitude, this.lat_lng.longitude)
            .subscribe (mapdata => {
              let map_address = '';
              let map_pin = '';
              this.obtained_address = '';
              if (mapdata['status'] === 'OK') {
                // console.log(mapdata['results']);
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
                      this.mapaddress.push( { 'address': formataddress, 'pin': curpin });
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
              this.obtained_address = map_address;
              this.obtained_pin = map_pin;
            });
          });
        } catch (error) {
          // blah
        }
      };

      this.marker.addListener('dragend', getLatLng.bind(this));
      this.map.addListener('click', getLatLng.bind(this));

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {

      });

      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchElementRef.nativeElement);

      autocomplete.addListener('place_changed', () => {
        this._ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          // this.latitude = place.geometry.location.lat();
          // this.longitude = place.geometry.location.lng();
          // this.zoom = 12;
          this.map.setCenter(place.geometry.location);
          this.placeMarker(place.geometry.location, this.map);
          const ob = {latLng: place.geometry.location};
          getLatLng(ob);
        });
      });

     }


     placeMarker(location, map) {
      if ( this.marker ) {
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
          'pincode': this.obtained_pin
        };
        this.dialogRef.close(retvalues);
    }
    mapaddress_change(addressR) {
      this.obtained_address = addressR.address;
      this.obtained_pin = addressR.pin;
      // this.mapselectionDone();
    }
}
