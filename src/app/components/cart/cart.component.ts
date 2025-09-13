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
  cartItemCount = computed(() => this.cartService.cartSummary$().totalItems);
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

  get groupedCartItems(): { [key: string]: CartItem[] } {
    const grouped: { [key: string]: CartItem[] } = {};
    
    this.cartItems().forEach(item => {
      if (!grouped[item.drink.category]) {
        grouped[item.drink.category] = [];
      }
      grouped[item.drink.category].push(item);
    });
    
    return grouped;
  }

  get categoryKeys(): string[] {
    return Object.keys(this.groupedCartItems);
  }

  getCategoryTotal(category: string): number {
    return this.groupedCartItems[category].reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  toggleModal(action: 'show' | 'hide'): void {
    const modalElement = document.getElementById('cartModal');
    const bootstrapNs = (window as any).bootstrap;
    if (modalElement && bootstrapNs?.Modal) {
      if (action === 'show') {
        this.isModalOpen.set(true);
        const modal = new bootstrapNs.Modal(modalElement);
        modal.show();
      } else {
        this.isModalOpen.set(false);
        const modal = bootstrapNs.Modal.getInstance(modalElement);
        if (modal) {  
          modal.hide();
        }

          const backdrops = document.getElementsByClassName('modal-backdrop');

        Array.from(backdrops).forEach((backdrop: Element) => {
          // Trigger fade out by removing the 'show' class
          backdrop.classList.remove('show');

          // Wait for CSS transition to finish before removing the element
          // Assuming Bootstrap's default transition of 150ms
          setTimeout(() => {
            backdrop.remove();
          }, 150);
        });
      }
    }
  }
}