import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Drink } from '../../models/drink.model';
import { CartService } from '../../services/cart.service';
import menuData from '../../data/menu-data.json';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  drinks = signal<Drink[]>([]);
  selectedSize = signal<'tall' | 'grande' | 'venti'>('tall');
  selectedTemperature = signal<'hot' | 'cold'>('hot');
  selectedCategory = signal<'All' | 'Coffee' | 'Tea'>('All');
  selectedDrink = signal<Drink | null>(null);
  quantity = signal<number>(1);

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.drinks.set(menuData as Drink[]);
  }

  get filteredDrinks(): Drink[] {
    return this.drinks().filter(drink => {
      const categoryMatch = this.selectedCategory() === 'All' || drink.category === this.selectedCategory();
      return categoryMatch;
    });
  }

  onSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = target.value as 'tall' | 'grande' | 'venti';
    this.selectedSize.set(size);
  }

  onSizeClick(size: string): void {
    this.selectedSize.set(size as 'tall' | 'grande' | 'venti');
  }

  onTemperatureChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const temperature = target.value as 'hot' | 'cold';
    this.selectedTemperature.set(temperature);
  }

  onTemperatureClick(temperature: string): void {
    this.selectedTemperature.set(temperature as 'hot' | 'cold');
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const category = target.value as 'All' | 'Coffee' | 'Tea';
    this.selectedCategory.set(category);
  }

  onCategoryClick(category: string): void {
    this.selectedCategory.set(category as 'All' | 'Coffee' | 'Tea');
  }

  onQuantityChange(change: number): void {
    const newQuantity = this.quantity() + change;
    if (newQuantity >= 1) {
      this.quantity.set(newQuantity);
    }
  }

  onQuantityInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value >= 1) {
      this.quantity.set(value);
    } else {
      this.quantity.set(1);
      target.value = '1';
    }
  }

  addToCart(drink: Drink): void {
    // Add the item to cart with the selected quantity
    for (let i = 0; i < this.quantity(); i++) {
      this.cartService.addToCart(drink, this.selectedSize(), this.selectedTemperature());
    }
    this.toggleModal('hide');
    this.selectedSize.set('tall');
    this.selectedTemperature.set('hot');
    this.quantity.set(1);
  }

  getPrice(drink: Drink): number {
    return drink.sizes[this.selectedSize()];
  }

  getLabel(label: string): string {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  getAvailableSizes(drink: Drink | null): string[] {
    if (!drink || !drink.sizes) {
      return [];
    }
    return Object.keys(drink.sizes);
  }

  isImagePath(value: string | null | undefined): boolean {
    if (!value) {
      return false;
    }
    return value.startsWith('/') || value.startsWith('./') || value.startsWith('http');
  }

  openModal(drink: Drink): void {
    this.selectedDrink.set(drink);
    const availableSizes = this.getAvailableSizes(drink);
    if (availableSizes.length > 0) {
      this.selectedSize.set(availableSizes[0] as 'tall' | 'grande' | 'venti');
    }
    this.quantity.set(1);
    this.toggleModal('show');
  }

  private toggleModal(action: 'show' | 'hide'): void {
    const modalElement = document.getElementById('drinkDetailsModal');
    const bootstrapNs = (window as any).bootstrap;
    if (modalElement && bootstrapNs?.Modal) {
      if (action === 'show') {
        const modal = new bootstrapNs.Modal(modalElement);
        modal.show();
      } else {
        const modal = bootstrapNs.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }
}