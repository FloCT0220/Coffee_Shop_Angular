import { Component, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  imports: [ MenuComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private modalService: NgbModal) {}

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
