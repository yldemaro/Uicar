import { OnInit } from '@angular/core';
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  zones: any;
  trayectos: any;
  inicio: string;
  destino: string;
  buscado = false ;

  constructor(private http: HttpClient, public router: Router, private aut: AngularFireAuth) {

  }

  ngOnInit() {
    this.zonasload();
  }

  async zonasload() {
    await this.http.get(`http://uicar.openode.io/zonas/`).subscribe((data: any) => {
      this.zones = data;
    });
  }
  gotomain() {
    this.router.navigate(['home']);
  }
  gotoinfoTrayecto(id: string) {
    this.router.navigate([`/info-trayecto/${id}`]);
}

  gotoall() {
    this.router.navigate([`/todos-trayectos/${this.inicio}`]);
}

  async search() {
    await this.http.get(`http://uicar.openode.io/search/${this.inicio}/${this.destino}`).subscribe((data: any) => {
      this.trayectos = data;
      this.buscado = true;
      console.log(this.trayectos);
    });
  }

}
