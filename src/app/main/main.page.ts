import {Component, AfterViewInit, OnInit, DoCheck, OnChanges} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {ServicesService} from '../services.service';
import {HttpClient} from '@angular/common/http';
import {ModalController, Platform} from '@ionic/angular';
import {ModalPagePage} from '../modal-page/modal-page.page';
import {ModalTablonPage} from '../modal-tablon/modal-tablon.page';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


declare var google;


@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit, OnInit {
    uid: string;
    profiledata = [{nombre: 'Usuario', ubication: 'Madrid', whatsapp: ''}];
    tablondata = [];
    data = [];
    trayectos = [];
    zona = 'Madrid';
    nombre = 'Usuario';

    // Variables mapa

    key = 'AIzaSyATy7pX219NlBc9Sac6Biz0JgWR-cTB2f8';
    map: any;
    directionsDisplay: any;
    usuario: any;
    lat: number;
    num: any;
    lng: number;

    directionsService = new google.maps.DirectionsService();


    constructor(private aut: AngularFireAuth, public modalController: ModalController,
                private router: Router, public _servicie: ServicesService, private http: HttpClient,
                private geolocation: Geolocation, private statusBar: StatusBar) {}

    ngOnInit() {
        this.logueado();
        this.posicion();
    }

    ngAfterViewInit() {

        setTimeout(() => {
            this.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.zona = this.profiledata[0].ubication;
            this.nombre = this.profiledata[0].nombre;
            this.num = this.profiledata[0].whatsapp;
        }, 2000);

        setTimeout(() => {
            this.trayectosload(this.zona);
            this.tablonload(this.zona);
            this.rutas(this.zona);
        }, 3000);
    }

    posicion() {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            // console.log('tus cordenadas', this.lng, this.lat);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    async logueado() {
        await this.aut.authState
            .subscribe(
                user => {
                    if (!user) {
                        this.router.navigate(['/login']);
                    } else {
                        console.log('logueado');
                        this.uid = user.uid;
                    }
                });

        return this.uid;
    }

    // async presentModal() {
    //     const modal = await this.modalController.create({
    //         component: ModalPagePage,
    //     });
    //     return await modal.present();
    // }

    async presentModal2() {
        const modal2 = await this.modalController.create({
            component: ModalTablonPage,
            componentProps: {zona: this.zona, nombre: this.nombre}
        });
        return await modal2.present();
    }

    gotoprofile() {
        this.router.navigate([`/profile/${this.uid}`]);
    }

    gotoinfoTrayecto(id: string) {
        this.router.navigate([`/info-trayecto/${id}`]);
    }

    gotoPerfil(id: string) {
        this.router.navigate([`/profile/${id}`]);
    }

    gotoall() {
        this.router.navigate([`/todos-trayectos/${this.zona}`]);
    }
    gotosearch() {
        this.router.navigate([`/search/`]);
    }


    async profileload(id: string) {
        await this.http.get(`http://uicar.openode.io/users/${id}/info`).subscribe((data: any) => {
            // console.log(data);
            this.profiledata = data;
        });
    }

    async tablonload(id: string) {

        await this.http.get(`http://uicar.openode.io/tablon/${id}/5`).subscribe((data: any) => {

            this.tablondata = data;

        });
    }

    async trayectosload(id: string) {
        await this.http.get(`http://uicar.openode.io/zonas/${id}/3`).subscribe((data: any) => {
            // console.log(data);
            this.trayectos = data;
        });
    }


    // Mapa

    async rutas(zona: string) {

        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: {lat: this.lat, lng: this.lng},
            mapTypeId: 'terrain'
        });
        this.directionsDisplay.setMap(this.map);

        await this.http.get(`http://uicar.openode.io/zonas/${zona}/3`).subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                this.directionsService.route({
                    origin: data[i].inicio,
                    destination: data[i].destino,
                    travelMode: 'DRIVING'
                }, (response, status) => {
                    const waypoint_markers = [];
                    if (status === 'OK') {
                        this.directionsDisplay.setDirections(response);

                        this.directionsDisplay = new google.maps.DirectionsRenderer({
                            suppressBicyclingLayer: true
                            // suppressMarkers: true
                        });
                        const myRoute = response.routes[0].legs[0];
                        const marker = new google.maps.Marker({
                            position: myRoute.steps[0].start_point,
                            map: this.map,
                            id: data[i].id,
                            zIndex: 999999
                        });
                        this.attachInstructionText(marker);
                        const marker1 = new google.maps.Marker({
                            position: myRoute.steps[myRoute.steps.length - 1].end_point,
                            map: this.map,
                            id: data[i].id,
                            zIndex: 999999
                        });
                        this.attachInstructionText(marker1);
                        this.directionsDisplay.setMap(this.map);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }
        });
    }

    attachInstructionText(marker) {
        const self = this;
        google.maps.event.addListener(marker, 'click', function () {
            self.gotoinfoTrayecto(this.id);
        });
    }

    doRefresh(event) {

        this.posicion();
        this.logueado();

        setTimeout(() => {
            this.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.zona = this.profiledata[0].ubication;
            this.nombre = this.profiledata[0].nombre;
            this.num = this.profiledata[0].whatsapp;
        }, 2000);

        setTimeout(() => {
            this.trayectosload(this.zona);
            this.tablonload(this.zona);
            this.rutas(this.zona);
            event.target.complete();
        }, 3000);

    }

}
