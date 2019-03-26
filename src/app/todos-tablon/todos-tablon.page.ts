import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from '../services.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-todos-tablon',
  templateUrl: './todos-tablon.page.html',
  styleUrls: ['./todos-tablon.page.scss'],
})
export class TodosTablonPage implements OnInit {

  zona = 'Madrid';
  tablondata = [];
  cargado = false;

  constructor(private router: Router, public active: ActivatedRoute, private service: ServicesService , private http: HttpClient) {
    this.cargado = true;
    this.zona = this.active.snapshot.paramMap.get('zona');
  }

  ngOnInit() {
    this.zona = this.active.snapshot.paramMap.get('zona');
    this.tablonload();
    this.cargado = true;
  }
  gotomain() {
    this.router.navigate(['home']);
  }
  async tablonload() {
    await this.http.get(`http://uicar.openode.io/tablon/${this.zona}/100`).subscribe((data: any) => {
      this.tablondata = data;
      console.log(this.tablondata);
    });
  }
  gotoinfoTrayecto(id: string) {
    this.router.navigate([`/info-trayecto/${id}`]);
  }

  gotoPerfil(id: string) {
    this.router.navigate([`/profile/${id}`]);
}


}
