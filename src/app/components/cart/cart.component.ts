import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem, CartSummary } from '../../models/drink.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems = computed(() => this.cartService.cartItems$());
  cartSummary = computed(() => this.cartService.cartSummary$());
  isModalOpen = signal(false);

  constructor(private cartService: CartService) {}

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  updateQuantity(index: number, quantity: number): void {
    this.cartService.updateQuantity(index, quantity);
  }

  updateQuantityFromInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const quantity = +target.value;
    this.cartService.updateQuantity(index, quantity);
  }
  isImagePath(value: string | null | undefined): boolean {
    if (!value) {
      return false;
    }
    return value.startsWith('/') || value.startsWith('./') || value.startsWith('http');
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getSizeLabel(size: 'tall' | 'grande' | 'venti'): string {
    return size.charAt(0).toUpperCase() + size.slice(1);
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  openModal(): void {
    this.isModalOpen.set(true);
    const modalElement = document.getElementById('cartModal');
    const bootstrapNs = (window as any).bootstrap;
    if (modalElement && bootstrapNs?.Modal) {
      const modal = new bootstrapNs.Modal(modalElement);
      modal.show();
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    const modalElement = document.getElementById('cartModal');
    const bootstrapNs = (window as any).bootstrap;
    if (modalElement && bootstrapNs?.Modal) {
      const modal = bootstrapNs.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}