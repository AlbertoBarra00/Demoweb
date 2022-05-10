import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  showLogo: boolean = false;

  ngOnInit(): void {
    this.showLogo = true;
  }
}
