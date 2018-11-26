import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  latitude: number = 51.678418;
  longitude: number = 7.809007;
constructor(updates: SwUpdate) {
  updates.available.subscribe(event => {

    //this.update = true;
    updates.activateUpdate().then(() => document.location.reload());

  })
}

  onChoseLocation(event) {
    console.log(event)
  }

}
