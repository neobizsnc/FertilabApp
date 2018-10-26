import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { SearchresultPage } from '../searchresult/searchresult';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, MyLocation } from '@ionic-native/google-maps';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  autocomplete: any;
  autocompleteItems: any = [];
  loading: any;
  map: GoogleMap;

  constructor(public geolocation: Geolocation, public loadingCtrl: LoadingController, private keyboard: Keyboard, public http: Http, public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    this.autocomplete = {
      input: ''
    };

  }

  getLocationByPlugIn() {
    this.map = GoogleMaps.create('test');
    this.map.getMyLocation().then((location: MyLocation) => {
      this.getNameFromCordinate(location.latLng);
    })
  }

  ionViewDidLoad() {
    this.platform.ready().then((readySource) => { 
      document.getElementById("gridSearch").style.height = this.platform.height() + "px";
    });
  }

  updateSearchResults(){
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesListFertilab?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data); 
    });
  }

  selectSearchResult(item){
    console.log(item)
    this.autocompleteItems = [];   
    this.navCtrl.push(SearchresultPage, {
      city: item
    });
  }
  
  closeKeyboard() {
    this.keyboard.close();
  }


  getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
 
    });
    this.loading.present();
    var options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.getNameFromCordinate(pos);
     }).catch((error) => {
       this.getLocationByPlugIn();
       console.log('Error getting location', error);
     });
  }

  getNameFromCordinate(latlng) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
        this.autocomplete.input = results[0].formatted_address;
        this.loading.dismiss();
        this.geocodePlaceId(results[0])
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  geocodePlaceId(city) {
    var geocoder = new google.maps.Geocoder;
    var placeId = city.place_id;

    geocoder.geocode({'placeId': placeId}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.navCtrl.push(SearchresultPage, {
            city: results[0]
          });
          console.log(results[0])
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }


 
}
