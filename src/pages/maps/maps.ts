import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { SchedaPage } from '../scheda/scheda';


/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})


export class MapsPage {

  @ViewChild('mapcanvas') mapElement: ElementRef;
  centers: any = [];
  newMap: any;
  loading: any;
  selectedCenter:any;
  load: boolean = false;
  autocomplete: any;
  autocompleteItems: any = [];
  city: any;
  operatingSystem: any;
 

  constructor(public http: Http, public modalCtrl: ModalController, public platform: Platform, private zone: NgZone, public viewCtrl: ViewController, public geolocation: Geolocation, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
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
  }

  ionViewDidLoad() {
    this.centers = this.navParams.get('centers');
    this.getCurrentPosition();

    this.city = this.navParams.get('city')
    this.autocomplete.input = this.city.description
    
  }

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
          let latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          this.newMap.setCenter(latLng);
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
      this.setMarker(pos);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }


  getCurrentPositionSecond() {
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

  
  setMarker(pos) {

    let latLng = new google.maps.LatLng(pos.lat, pos.lng);
    let mapOptions = {
      center: latLng,
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    } 
    this.newMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    

    this.centers.forEach((val, index) => {
      let ico = 'assets/imgs/locMaps.png';
      let marker = new google.maps.Marker({
        position: {lat: parseFloat(val.lat), lng: parseFloat(val.lng)},
        map: this.newMap,
        icon: {  url : ico },
        title: 'Hello World!'
      });
      marker.addListener('click', () => {
        this.newMap.setZoom(6);
        this.newMap.setCenter(marker.getPosition());
        
        this.zone.run(() => {
          this.load = false;
          this.selectedCenter = val;
          this.load = true;
        });
        

      }); 
    });
    this.geocodePlaceId(this.city);

  }

  close() {
    this.viewCtrl.dismiss();
  }


}
