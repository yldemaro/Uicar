import { Component, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ModalTablonPage } from '../modal-tablon/modal-tablon.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';


declare var google;


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit {

  uid: string;
  profiledata = [{ nombre: '', ubication: '' }];
  tablondata = [];
  data = [];
  trayectos = [];
  numero = 2;
  zona: string;
  nombre: string;

  // Variables mapa

  key = 'AIzaSyATy7pX219NlBc9Sac6Biz0JgWR-cTB2f8';
  flightPath: any;
  map: any;
  marker: any;
  image = '../../assets/icons/marker.png';
  directionsDisplay: any;

  cargandoTrayecto: Boolean = true;
  cargandoPerfil: Boolean = true;
  cargandoTablon: Boolean = true;
  cargandoRutas: Boolean = true;


  lat: number;
  lng: number;

  directionsService = new google.maps.DirectionsService();


  constructor(private aut: AngularFireAuth, public modalController: ModalController,
    private router: Router, public _servicie: ServicesService, private http: HttpClient,
    private geolocation: Geolocation) {

    this.uid = localStorage.getItem('uid');
    console.log(this.uid);

    this.profileload();

    if (this.uid === undefined) {
      this.router.navigateByUrl('login');
    }

    this.zona = localStorage.getItem('ubication');
    this.nombre = localStorage.getItem('nombre');

    if (this.zona === null || this.zona === undefined) {
      this.zona = 'Madrid';

      localStorage.setItem('ubication', this.zona);
    }
    if (this.nombre === null || this.nombre === undefined) {
      this.nombre = 'Usuario';
      localStorage.setItem('nombre', this.nombre);
    }

    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log('tus cordenadas', this.lng, this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
  
  ngAfterViewInit() {
    setInterval(() => {
      this.trayectosload();
      this.tablonload();
    }, 5000);
    setTimeout(() => {
      this.rutas();
    }, 3000);
  }

  async presentModal() {
    console.log('Modal 1');
    const modal = await this.modalController.create({
      component: ModalPagePage,
    });
    return await modal.present();
  }

  async presentModal2() {
    this.nombre = localStorage.getItem('nombre');
    const modal2 = await this.modalController.create({
      component: ModalTablonPage,
      componentProps: { zona: this.zona, nombre: this.nombre }
    });
    return await modal2.present();
  }

  async profileload() {
    this.http.get(`http://uicar.openode.io/users/` + this.uid + '/info').subscribe((data: any) => {
      this.cargandoPerfil = false;
      this.profiledata = data;
      localStorage.setItem('nombre', this.profiledata[0].nombre);
      localStorage.setItem('ubication', this.profiledata[0].ubication);
    });
  }
  async tablonload() {
    this.zona = localStorage.getItem('ubication');
    await this.http.get(`http://uicar.openode.io/zonas/${this.zona}/tablon`).subscribe((data: any) => {
      this.cargandoTablon = false;
      this.tablondata = data;
    });
  }

  async trayectosload() {
    this.zona = localStorage.getItem('ubication');
    await this.http.get(`http://uicar.openode.io/zonas/${this.zona}`).subscribe((data: any) => {
      this.cargandoTrayecto = false;
      this.trayectos = data;
    });
  }

  open(id: number) {
    this.router.navigateByUrl('info-trayecto' + '/' + id);
  }


  // Mapa

  // Mapa

  rutas() {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: { lat: this.lat, lng: this.lng },
      mapTypeId: 'terrain'
    });
    this.directionsDisplay.setMap(this.map);


    this.zona = localStorage.getItem('ubication');
    setInterval(() => {
      this.http.get(`http://uicar.openode.io/zonas/${this.zona}`).subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.directionsService.route({
            origin: data[i].inicio,
            destination: data[i].destino,
            travelMode: 'DRIVING'
          }, (response, status) => {
            if (status === 'OK') {
              this.cargandoRutas = false;
              this.directionsDisplay = new google.maps.DirectionsRenderer({
                suppressBicyclingLayer: false,
                suppressMarkers: true
              });
              this.directionsDisplay.setMap(this.map);

              this.directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
      });
    }, 15000);





  }

}
