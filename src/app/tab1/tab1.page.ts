import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.locatecontrol';
import { HttpClient } from '@angular/common/http';
import { StylesCompileDependency } from '@angular/compiler';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map : any;
  json ;
  ionViewDidEnter(){
    this.leafletMap();
  }


    /** Remove map when we have multiple map object */
    ionViewWillLeave() {
      this.map.remove();
    }

  leafletMap(){
    
  

      this.map = L.map('mapId',).setView([-9.194766851999916, -74.99025479649974], 5);
      /*tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'edupala.com © ionic LeafLet',
      }).addTo(this.map);
  */
  
      let mytile=L.tileLayer('assets/mapa/{z}/{x}/{y}.png', {
        maxZoom: 9,
        tms: true,
        //attribution: 'edupala.com © ionic LeafLet',
      }).addTo(this.map);


      let drawnItems = new L.FeatureGroup();
     this.map.addLayer(drawnItems);
     var drawControl = new L.Control.Draw({
         edit: {
             featureGroup: drawnItems
         }
     });
     
     this.map.addControl(drawControl);

  

    L.control.layers({'Capa Base':mytile}).addTo(this.map);
    /*this.map.locate({setView: true, maxZoom: 16});*/

/*

      marker([28.6, 77]).addTo(this.map)
        .bindPopup('Ionic 4 <br> Leaflet.')
        .openPopup();*/


     this.map.on(L.Draw.Event.CREATED,(e)=>{
        let layer = e.layer;
        drawnItems.addLayer(layer);
     });   


     

     this.http.get('assets/geojson/departamento.json').subscribe((json: any) => {
      this.json = json;
      L.geoJSON(this.json,{
        style:this.styleDep,
        onEachFeature:this.onEachFeatureDep
      }).addTo(this.map);
      
    });


    

     /*let lc = L.control.locate({
      position: 'topright',
      strings: {
          title: "Show me where I am, yo!"
      }
    }).addTo(this.map);*/

  }


  styleDep(feature :any){
      return{
        weigth:0.5,
        opacity:1,
        color:'black',
        fillOpacity: 0.8,
    }
      
  }

  onEachFeatureDep(feature:any,layer:any){

    layer.bindTooltip(feature.properties.NOMBDEP,{permanent:false,direction:"center",opacity:0.5 });
    //layer.bindTooltip(feature.properties.NOMBDEP,{permanent:true,direction:"center",className: 'myCSSClass' });
  }

  constructor(private http: HttpClient) {}

}
