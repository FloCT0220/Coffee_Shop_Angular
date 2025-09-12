import { Injectable, signal, computed, effect, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Drink, CartItem, CartSummary } from '../models/drink.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private readonly storageKey = 'cart_session_v1';
  private readonly expiryMs = 5 * 60 * 1000; // 5 minutes

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.restoreFromSession();

    // Persist on every change (browser only)
    effect(() => {
      const items = this.cartItems();
      this.saveToSession(items);
    });
  }

  // Computed signals for reactive updates
  cartItems$ = computed(() => this.cartItems());
  
  cartSummary$ = computed(() => {
    const items = this.cartItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const coffeeTotal = items
      .filter(item => item.drink.category === 'Coffee')
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const teaTotal = items
      .filter(item => item.drink.category === 'Tea')
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      totalItems,
      totalPrice,
      coffeeTotal,
      teaTotal
    } as CartSummary;
  });

  addToCart(drink: Drink, size: 'tall' | 'grande' | 'venti', temperature: 'hot' | 'cold', quantity: number = 1): void {
    const price = drink.sizes[size];
    const existingItemIndex = this.cartItems().findIndex(
      item => item.drink.id === drink.id && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...this.cartItems()];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        drink,
        size,
        temperature,
        quantity,
        price
      };
      this.cartItems.set([...this.cartItems(), newItem]);
    }
  }

  removeFromCart(itemIndex: number): void {
    const updatedItems = this.cartItems().filter((_, index) => index !== itemIndex);
    this.cartItems.set(updatedItems);
  }

  updateQuantity(itemIndex: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemIndex);
      return;
    }

    const updatedItems = [...this.cartItems()];
    updatedItems[itemIndex].quantity = quantity;
    this.cartItems.set(updatedItems);
  }

  clearCart(): void {
    this.cartItems.set([]);
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.storageKey);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems();
  }

  getCartSummary(): CartSummary {
    return this.cartSummary$();
  }

  private restoreFromSession(): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as { items: CartItem[]; expiresAt: number };
      if (typeof parsed.expiresAt === 'number' && Date.now() < parsed.expiresAt && Array.isArray(parsed.items)) {
        this.cartItems.set(parsed.items);
      } else {
        sessionStorage.removeItem(this.storageKey);
      }
    } catch {
      // Corrupt storage; clear it
      sessionStorage.removeItem(this.storageKey);
    }
  }

  private saveToSession(items: CartItem[]): void {
    if (!this.isBrowser()) {
      return;
    }
    try {
      const payload = {
        items,
        expiresAt: Date.now() + this.expiryMs
      };
      sessionStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // Ignore storage errors (quota, etc.)
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}