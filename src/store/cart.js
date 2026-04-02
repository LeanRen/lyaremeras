import { atom } from 'nanostores';

export const cartItems = atom([]);
export const isCartOpen = atom(false);

export function addToCart(product, quantityToAdd = 1, talle = 'L') {
  const items = cartItems.get();
  
  // Buscamos si ya existe la combinación exacta de ID + TALLE
  const existing = items.find(i => i.id === product.id && i.talle === talle);

  if (existing) {
    cartItems.set(items.map(i => 
      (i.id === product.id && i.talle === talle) 
        ? { ...i, quantity: i.quantity + quantityToAdd } 
        : i
    ));
  } else {
    if (quantityToAdd < 0) return;
    // Guardamos el producto con su talle específico
    cartItems.set([...items, { ...product, quantity: quantityToAdd, talle: talle }]);
  }
}

export function removeFromCart(id, talle) {
  cartItems.set(cartItems.get().filter(i => !(i.id === id && i.talle === talle)));
}

export function clearCart() {
  cartItems.set([]);
}