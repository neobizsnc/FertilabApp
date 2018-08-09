import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchresultPage } from '../searchresult/searchresult';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  autocomplete: any;
  autocompleteItems: any = [];

  constructor(public http: Http, public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    this.autocomplete = {
      input: ''
    };
  }

  ionViewDidLoad() {
    this.platform.ready().then((readySource) => { 
      document.getElementById("gridSearch").style.height = this.platform.height() + "px";
    });
  }

  updateSearchResults(){

    console.log("qui")
    //AIzaSyDZ15vkJWNNl3tpZWRAPvoA3tBkpTqUt0k
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesList?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data[0]); 
    });
  }

  //AIzaSyDZ15vkJWNNl3tpZWRAPvoA3tBkpTqUt0k
  selectSearchResult(item){
    this.autocompleteItems = [];   
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetGeocode?Address=' + item.description + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      if(data.status === 'OK' && data.results[0]){
          this.autocomplete.input = '';
          this.navCtrl.push(SearchresultPage, {
            city: data.results[0]
          });
      }
    });
  } 
 
}
