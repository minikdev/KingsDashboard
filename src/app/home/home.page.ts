import { Component, OnInit } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';
import { ModelPageComponent } from '../model-page/model-page.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  squad = [];
  draftsSquad = [];
  vampires = [];
  wizards = [];
  vigilantes = [];
  king: string;
  oldKing: string;
  allTypes = [];

  constructor(
    public alertController: AlertController,
    public modalController: ModalController
  ) {}

  ngOnInit(): void {}

  async addToSquad() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add player to squad',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Playername',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.name && data.name !== '' && this.isNotInSquad(data.name)) {
              this.squad.push(data.name);
              this.draftsSquad.push(data.name);
            }
          },
        },
      ],
    });

    await alert.present();
  }
  isNotInSquad(name: string) {
    for (let i = 0; i < this.squad.length; i++) {
      if (name === this.squad[i]) {
        this.presentAlert('This player already exists!');
        return false;
      }
    }
    return true;
  }

  drawPlayer(playerType: string[]) {
    var randomEl = Math.floor(Math.random() * this.draftsSquad.length);

    if (this.isNotValid(randomEl)) {
      return;
    }
    playerType.push(this.draftsSquad[randomEl]);
    this.draftsSquad = this.draftsSquad.filter(
      (value) => value !== this.draftsSquad[randomEl]
    );
  }

  drawKing() {
    if (this.king) {
      return;
    }
    var randomEl = Math.floor(Math.random() * this.draftsSquad.length);

    if (this.isNotValid(randomEl)) {
      return;
    }

    if (this.draftsSquad[randomEl] === this.oldKing) {
      this.drawKing();
      return;
    }
    this.king = this.draftsSquad[randomEl];
    console.log('Kral seçildi: ', this.king);
    this.draftsSquad = this.draftsSquad.filter((value) => value !== this.king);
  }

  async restartGame() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Restart',
      message: 'Do you want to keep squad?',
      buttons: [
        {
          text: 'No',

          cssClass: 'secondary',
          handler: (blah) => {
            this.squad = [];
            this.draftsSquad = [];
            this.vampires = [];
            this.wizards = [];
            this.vigilantes = [];
            this.king = undefined;
            this.oldKing = undefined;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.vampires = [];
            this.wizards = [];
            this.vigilantes = [];
            this.draftsSquad = this.squad;
            this.oldKing = this.king;
            this.king = undefined;
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(messagee: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Nope!',
      message: messagee,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentModal() {
    this.prepareAllTypesArray();

    const modal = await this.modalController.create({
      component: ModelPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        squad: this.squad,
        allTypes: this.allTypes,
        king: this.king,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.takeData(data);
  }

  prepareAllTypesArray() {
    this.allTypes.push(this.vampires);
    this.allTypes.push(this.wizards);
    this.allTypes.push(this.vigilantes);
    this.allTypes.push(this.draftsSquad);
  }

  takeData(data: any) {
    this.squad = data.squad;
    this.vampires = data.vampires;
    this.wizards = data.wizards;
    this.vigilantes = data.vigilantes;
    this.king = data.king;
    this.draftsSquad = data.draftsSquad;
    this.allTypes = [];
  }

  isNotValid(randomEl: any): boolean {
    return this.draftsSquad[randomEl] === '' || !this.draftsSquad[randomEl];
  }
}
