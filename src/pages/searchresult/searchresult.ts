import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Geolocation } from '@ionic-native/geolocation';
import { SchedaPage } from '../scheda/scheda';
import { MapsPage } from '../maps/maps';

/**
 * Generated class for the SearchresultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@Component({
  selector: 'page-searchresult',
  templateUrl: 'searchresult.html',
})
export class SearchresultPage {

  centers: any = [];
  autocomplete: any;
  autocompleteItems: any = [];
  city: any;
  operatingSystem: any;
  loading: any;

  constructor(public modalCtrl: ModalController, public geolocation: Geolocation, public loadingCtrl: LoadingController, public platform: Platform, private zone: NgZone, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.autocomplete = {
      input: ''
    };
    platform.ready().then(() => { 
      if(this.platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.getNameFromCordinate(pos);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  ionViewDidLoad() {
    this.city = this.navParams.get('city')
    this.autocomplete.input = this.city.description
    this.geocodePlaceId(this.city);
  }
  
  //e la stessa di fertilab, ritorna la lista google delle citta
  updateSearchResults(){
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesList?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data); 
    });
  }

  selectSearchResult(item){
    this.autocompleteItems = [];
    this.city = item;
    this.autocomplete.input = item.description
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.geocodePlaceId(item); 
  } 

  getCenter(lat, lng) {
    this.centers = [];
    var position = {
      "Latitude" : lat,
      "Longitude" : lng
    }
    this.http.post('http://fertilab.azurewebsites.net/api/CentersApi/GetCenterByLocation', position).map(res => res.json()).subscribe(data => {
      this.zone.run(() => {
          data.forEach(element => {
            element.distance = parseInt(element.distance)
            element.address = element.address + " " + element.city + " " + element.province
            this.centers.push(element);
          });
          this.loading.dismiss();  
      })  
    });
  }

  getNameFromCordinate(latlng) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
        this.autocomplete.input = results[0].formatted_address;
        this.geocodePlaceId(results[0])
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }



  geocodePlaceId(city) {
    var geocoder = new google.maps.Geocoder;
    var placeId = city.place_id;
    this.centers = [];
    geocoder.geocode({'placeId': placeId}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.getCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng())
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  goToScheda(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
    profileModal.present();
  }

  goToMaps() {
    let mapsModal = this.modalCtrl.create(MapsPage, { centers: this.centers, city: this.city });
    mapsModal.present();
  }

}
