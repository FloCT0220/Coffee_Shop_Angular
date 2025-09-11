import { Component, signal } from '@angular/core';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Coffee Shop Menu');
}
