export interface Drink {
  id: number;
  name: string;
  category: 'Coffee' | 'Tea';
  description: string;
  sizes: {
    tall: number;
    grande: number;
    venti: number;
  };
  image?: string | null;
}

export interface CartItem {
  drink: Drink;
  size: 'tall' | 'grande' | 'venti';
  temperature: 'hot' | 'cold';
  quantity: number;
  price: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  coffeeTotal: number;
  teaTotal: number;
}