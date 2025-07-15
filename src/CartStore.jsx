import { atom, useAtom } from 'jotai';

// Define the initial state of the cart. We put in one piece of test data
const initialCart = [
{
    "id": 1,
    "product_id": 1,
    "quantity": 10,
    "productName": "Organic Green Tea",
    "price": 12.99,
    "imageUrl": "https://picsum.photos/id/225/300/200",
    "description": "Premium organic green tea leaves, rich in antioxidants and offering a smooth, refreshing taste."
  },
];

// Create an atom for the cart
export const cartAtom = atom(initialCart);

// Custom hook for cart operations
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);

  // Function to calculate the total price of items in the cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // add in setters here

    const addToCart = (product) => {
				// check if the product is already in the shopping cart
        const existingCartItem = cart.find(cartItem => cartItem.product_id === product.id);

        // if the product is not in the cart
        if (!existingCartItem) {
            // create a new cart item and add to cart
            const newCartItem = {
                id: Math.floor(Math.random() * 1000 + 1),
                product_id: product.id,
                productName: product.name,
                imageUrl: product.image,
                description: product.description,
                quantity: 1,
                price: product.price
            }
            const cloned = [...cart, newCartItem];
            setCart(cloned);
        } else {
            modifyQuantity(existingCartItem.product_id, existingCartItem.quantity + 1)
        }
    }

  return {
    cart,
    getCartTotal,
  };
};