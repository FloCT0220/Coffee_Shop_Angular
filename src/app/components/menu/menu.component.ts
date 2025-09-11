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
  selectedTemperature = signal<'All' | 'Hot' | 'Cold'>('All');
  selectedCategory = signal<'All' | 'Coffee' | 'Tea'>('All');

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.drinks.set(menuData as Drink[]);
  }

  get filteredDrinks(): Drink[] {
    return this.drinks().filter(drink => {
      const categoryMatch = this.selectedCategory() === 'All' || drink.category === this.selectedCategory();
      const temperatureMatch = this.selectedTemperature() === 'All' || 
                             drink.temperature === this.selectedTemperature() || 
                             drink.temperature === 'Both';
      return categoryMatch && temperatureMatch;
    });
  }

  onSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = target.value as 'tall' | 'grande' | 'venti';
    this.selectedSize.set(size);
  }

  onSizeButtonClick(size: string): void {
    this.selectedSize.set(size as 'tall' | 'grande' | 'venti');
  }

  onTemperatureChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const temperature = target.value as 'All' | 'Hot' | 'Cold';
    this.selectedTemperature.set(temperature);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const category = target.value as 'All' | 'Coffee' | 'Tea';
    this.selectedCategory.set(category);
  }

  addToCart(drink: Drink): void {
    this.cartService.addToCart(drink, this.selectedSize());
  }

  getPrice(drink: Drink): number {
    return drink.sizes[this.selectedSize()];
  }

  getSizeLabel(size: string): string {
    return size.charAt(0).toUpperCase() + size.slice(1);
  }
}