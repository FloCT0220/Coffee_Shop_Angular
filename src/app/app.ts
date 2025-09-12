import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MenuComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Coffee Shop Menu');
  cartItemCount = computed(() => this.cartService.cartSummary$().totalItems);

  constructor(private modalService: NgbModal, private cartService: CartService) {}

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  openCartModal(): void {
    const modalElement = document.getElementById('cartModal');
    const bootstrapNs = (window as any).bootstrap;
    if (modalElement && bootstrapNs?.Modal) {
      const modal = new bootstrapNs.Modal(modalElement);
      modal.show();
    }
  }
}
