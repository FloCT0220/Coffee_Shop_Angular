import { Injectable, signal, computed } from '@angular/core';
import { Drink, CartItem, CartSummary } from '../models/drink.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

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

  addToCart(drink: Drink, size: 'tall' | 'grande' | 'venti', quantity: number = 1): void {
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
  }

  getCartItems(): CartItem[] {
    return this.cartItems();
  }

  getCartSummary(): CartSummary {
    return this.cartSummary$();
  }
}