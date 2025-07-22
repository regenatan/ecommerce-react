import { atom, useAtom } from 'jotai';
import axios from 'axios';
import { useJwt } from "./UserStore";
import { useFlashMessage } from "./FlashMessageStore";

const initialCart = [];

export const cartAtom = atom(initialCart);
export const cartLoadingAtom = atom(false);

export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const { getJwt } = useJwt();
    const { showMessage } = useFlashMessage();

        const fetchCart = async () => {
        const jwt = getJwt();
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/cart", {
            headers: {
                Authorization: "Bearer " + jwt
            }
        })
            .catch((e) => {
                console.error(e);
            });
        console.log(response.data);
        setCart(response.data);
    }

    const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);


     const updateCart = async (modifiedCart) => {
        const jwt = getJwt();
        const cartData = modifiedCart.map(cartItem => ({
            product_id: cartItem.product_id,
            quantity: cartItem.quantity
        }));
        await axios.put(import.meta.env.VITE_API_URL + "/api/cart", { "cartItems": cartData}, {
            headers:{
                Authorization:'Bearer ' + jwt
            }
        })
        .catch(e => {
            console.error(e);
            showMessage("Error updating the cart", "danger");
        })
        
    }

    /*
      Contract of the product object should be:
      - id: int, primary key of the product
      - product_name: string, name of the product
      - quantity: int, the quantity
      - price: decimal
      - image_url: URL of the image
      - description: string
    */
 
      const addToCart = (product) => {

        // check if the product is already in the shopping cart
        const existingCartItem = cart.find(cartItem => cartItem.product_id === product.id);

        // if the product is not in the cart
        if (!existingCartItem) {
            // create a new cart item and add to cart
            const newCartItem = {
                id: Math.floor(Math.random() * 1000 + 1),
                product_id: product.id,
                product_name: product.name,
                image_url: product.image,
                description: product.description,
                quantity: 1,
                price: product.price
            }
            const cloned = [...cart, newCartItem];
            setCart(cloned);
            updateCart(cloned);
        } else {
            modifyQuantity(existingCartItem.product_id, existingCartItem.quantity + 1)
        }
    }

    const modifyQuantity = async (product_id, quantity) => {

        if (quantity < 1) {
            return;
        }

        // check if the product is already in the shopping cart
        const existingCartItem = cart.find(cartItem => cartItem.product_id === product_id);

        // modifying the cart item's quantity to be its current quantity + 1
        const clonedCartItem = { ...existingCartItem, "quantity": quantity };

        // const cloned = cart.map(currentCartItem => {
        //     if (currentCartItem.id !== clonedCartItem.id) {
        //         return currentCartItem
        //     } else {
        //         return clonedCartItem;
        //     }
        // })

        const cloned = cart.map(i => i.id !== clonedCartItem.id ? i : clonedCartItem);
        updateCart(cloned);
        await setCart(cloned);
      
    }

    const removeFromCart = (product_id) => {
        const existingCartItem = cart.find(i => i.product_id === product_id);
        const cloned = cart.filter(currentCartItem => currentCartItem.id !== existingCartItem.id)
        setCart(cloned);
        updateCart(cloned);
    }



    return {
        cart,
        addToCart,
        updateCart,
        modifyQuantity,
        removeFromCart,
        fetchCart
    }
}