import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public afs: AngularFireAuth, public rout: Router, public service: ServicesService,
    public alertController: AlertController) {
    this.service.initializeApp();
  }

  async login() {

    const { username, password } = this;
    try {
      const res = await this.afs.auth.signInWithEmailAndPassword(username, password).then(data => {
        this.rout.navigate(['/home']);
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.errorContrasena();
      } else if (error.code === 'auth/user-not-found') {
        this.errorUsuario();
      }
    }
  }
  async loginGmail() {
    try {
      const res = await this.afs.auth.signInWithPopup(new auth.GoogleAuthProvider());
      this.presentAlert(this.username);
      this.rout.navigate(['/home']);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.errorContrasena();
      } else if (error.code === 'auth/user-not-found') {
        this.errorUsuario();
      }
    }
  }

  goRegister() {
    this.rout.navigate(['/register']);
  }

  async presentAlert(username) {
    const alert = await this.alertController.create({
      header: 'Logueado como: ',
      message: `${username}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorContrasena() {
    const alert = await this.alertController.create({
      message: 'Lo siento su contraseña es incorrecta',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorUsuario() {
    const alert = await this.alertController.create({
      message: 'Lo siento su email o usuario no se encuentra registrado',
      buttons: ['OK']
    });

    await alert.present();
  }

}
