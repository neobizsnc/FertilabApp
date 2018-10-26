import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { SchedaPage } from '../scheda/scheda';
import { Keyboard } from '@ionic-native/keyboard';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GoogleMaps, GoogleMap, MyLocation } from '@ionic-native/google-maps';

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
  markers: any[] = [];
  map: GoogleMap;
  mark: any;

  constructor(public diagnostic: Diagnostic, public locationAccuracy: LocationAccuracy, private keyboard: Keyboard, public http: Http, public modalCtrl: ModalController, public platform: Platform, private zone: NgZone, public viewCtrl: ViewController, public geolocation: Geolocation, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
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

  getLocationByPlugIn() {
    this.map = GoogleMaps.create('test');
    this.map.getMyLocation().then((location: MyLocation) => {
      this.setMarker(location.latLng);
    })
  }

  getLocationByPlugInSecond() {
    this.map = GoogleMaps.create('test');
    this.map.getMyLocation().then((location: MyLocation) => {
      this.getNameFromCordinate(location.latLng);
    })
  }

  closeKeyboard() {
    this.keyboard.close();
  }


  ionViewDidLoad() {
    this.centers = this.navParams.get('centers');
    this.city = this.navParams.get('city')
    if(this.city.description) {
      this.autocomplete.input = this.city.description
    }
    if(this.city.formatted_address) {
      this.autocomplete.input = this.city.formatted_address
    }
    this.getCurrentPosition();
  }
        
  

  updateSearchResults(){
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesListFertilab?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data); 
    });
  }

  selectSearchResult(item){
    this.autocompleteItems = [];
    this.city = item;
    this.autocomplete.input = item.description
    this.loading = this.loadingCtrl.create({
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

          if(this.mark) {
            this.mark.setIcon( 'assets/imgs/locMaps.png');
          }
          
          this.mark= new google.maps.Marker({
            position: {lat: parseFloat(this.centers[0].lat), lng: parseFloat(this.centers[0].lng)},
            map: this.newMap,
            icon: {  url : 'assets/imgs/GEO_Division_ON.png' },
            title: 'Hello World!'
          });
          this.newMap.panTo(this.mark.getPosition());
          this.selectedCenter = this.centers[0];
          this.load = true;
          this.resetMarkers();


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

  getGeocodePlaceId(city) {
    var geocoder = new google.maps.Geocoder;
    var placeId = city.place_id;
    geocoder.geocode({'placeId': placeId}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          var pippo = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          console.log("PIPPO", pippo)
          this.setMarker(pippo)
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
    //set options.. 
    var options = {
      enableHighAccuracy: false ,
      timeout: 5000 //sorry I use this much milliseconds
    }
    this.loading = this.loadingCtrl.create({

    });
    this.loading.present();
    this.geolocation.getCurrentPosition(options).then((resp) => {
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.setMarker(pos);
     }).catch((error) => {
       this.loading.dismiss();
       this.getLocationByPlugIn();
       console.log('Error getting location', error);
     });
  }


  getCurrentPositionSecond() {
    this.loading = this.loadingCtrl.create({

    });
    this.loading.present();
    var options = {
      enableHighAccuracy: false ,
      timeout: 3000 //sorry I use this much milliseconds
    }
    this.geolocation.getCurrentPosition(options).then((resp) => {
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.getNameFromCordinate(pos);
     }).catch((error) => {
      this.getLocationByPlugInSecond();
       console.log('Error getting location', error);
     });
  }

  
  setMarker(pos) {

    let latLng = new google.maps.LatLng(pos.lat, pos.lng);
    let mapOptions = {
      center: latLng,
      zoom: 18,
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
      marker.addListener('click', (mk) => {
        this.newMap.setZoom(18);
        this.newMap.panTo(marker.getPosition());
        this.zone.run(() => {
          this.resetMarkers();
          this.load = false;
          marker.setIcon('assets/imgs/GEO_Division_ON.png');
          this.selectedCenter = val;
          this.load = true;
          if(this.mark) {
            this.mark.setIcon( 'assets/imgs/locMaps.png');
          }
        });
      }); 
      this.markers.push(marker);
    });
    this.newMap.panTo(this.markers[0].getPosition());
    this.markers[0].setIcon('assets/imgs/GEO_Division_ON.png');
    this.selectedCenter = this.centers[0];
    this.load = true;
    this.geocodePlaceId(this.city);

  }

  resetMarkers () {

    this.markers.forEach((val, index) => {
      val.setIcon( 'assets/imgs/locMaps.png');
    })
  }



  close() {
    this.viewCtrl.dismiss();
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

}
