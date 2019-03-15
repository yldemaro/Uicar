import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-todos-trayectos',
  templateUrl: './todos-trayectos.page.html',
  styleUrls: ['./todos-trayectos.page.scss'],
})
export class TodosTrayectosPage implements OnInit {

  zona = 'Madrid';
  trayectos = [];
  cargado: boolean;

  constructor(private router: Router, public active: ActivatedRoute, private service: ServicesService) {
    this.cargado = true;
    this.zona = this.active.snapshot.paramMap.get('zona');
  }

  ngOnInit() {
    this.zona = this.active.snapshot.paramMap.get('zona');
    this.trayectosload();
  }
  gotomain() {
    this.router.navigate(['home']);
  }

  async trayectosload() {
    await this.service.todoTrayectos(this.zona).subscribe((data: any) => {
      this.cargado = false;
      this.trayectos = data;
    });
  }
  gotoinfoTrayecto(id: string) {
    this.router.navigate([`/info-trayecto/${id}`]);
  }

}
