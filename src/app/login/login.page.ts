import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string;
  password: string;
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(public afs: AngularFireAuth,
    public rout: Router,
    public service: ServicesService,
    public alertController: AlertController,
    public loadingController: LoadingController, ) {

  }

  async login() {

    const { username, password } = this;
    try {
      const res = await this.afs.auth.signInWithEmailAndPassword(username, password).then(data => {
        this.rout.navigate(['/home']);
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.error('Contraseña incorrecta');
      }  if (error.code === 'auth/user-not-found') {
        this.error('Ese gmail no pertenece a ningún usuario');
      }
      if ( error.code === 'auth/argument-error') {
        this.error('Revisa los campos');
       }
       if ( error.code === 'auth/invalid-email') {
        this.error('Email es invalido');
       }
    }
  }

  async loginGmail() {
    const loading = await this.loadingController.create({
      message: 'No se encuentra disponible'
    });
    this.presentLoading(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 3000);


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

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorUsuario() {
    const alert = await this.alertController.create({
      message: 'Lo siento su email o usuario no se encuentra registrado',
    });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

  // contraseña

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}


}
