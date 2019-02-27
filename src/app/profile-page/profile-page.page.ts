import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { JsonPipe } from '@angular/common';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {

  profiledata = [];
  profiletrayectos = [];

  uid: string;
  uidprofile: string;
  userprofile: boolean;
  uidP: string;



  constructor(private http: HttpClient, private aut: AngularFireAuth,
    private router: Router, public active: ActivatedRoute, private auth: ServicesService) {



    if (localStorage.getItem('uid') === null || localStorage.getItem('uid') === undefined) {
      this.router.navigateByUrl('/login');
    }

    this.uid = this.active.snapshot.paramMap.get('id');


    setTimeout(() => {
      this.uidP = localStorage.getItem('uid');
      this.uid = this.active.snapshot.paramMap.get('id');
      console.log(this.uidP);
    }, 2000);

    setTimeout(() => {
      this.profileload(this.uid);
      this.trayectosload(this.uid);
    }, 3000);


  }

  ngOnInit() {

  }

  async profileload(id: string) {
    console.log(id);
    await this.http.get(`http://uicar.openode.io/users/` + id + '/info').subscribe((data: any) => {
      console.log(data);
      this.profiledata = data;
    });
  }

  async trayectosload(id: string) {
    await this.http.get(`http://uicar.openode.io/users/` + id + '/trayectos').subscribe((data2: any) => {
      this.profiletrayectos = data2;
    });
  }

  gotomain() {
    this.router.navigateByUrl('/');
  }
  gotoedit() {
    this.router.navigateByUrl('/edituser/' + this.uid);
  }
  create() {
    this.router.navigateByUrl('create');
  }

  gotowhatsapp(telf: string) {
    console.log(telf);
    const newurl = 'https://api.whatsapp.com/send?phone=' + telf;
    window.open(newurl, '_system', '_blank');

  }

  async doRefresh(event) {

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/info').subscribe((data: any) => {
      this.profiledata = data;
      event.target.complete();
    });

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/trayectos').subscribe((data2: any) => {
      this.profiletrayectos = data2;
      event.target.complete();
    });

  }


}
