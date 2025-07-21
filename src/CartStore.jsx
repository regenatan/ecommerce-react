import { atom, useAtom } from 'jotai';
import axios from 'axios';
import { useEffect, useRef } from "react";
import { useJwt } from "./UserStore";


export const cartAtom = atom(initialCart);
export const cartLoadingAtom = atom(false);

export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);

    const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);
    const { getJwt } = useJwt();

    const updateCart = async (updatedCart) => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            // .map  will generate the new array
            // which will consist of the elements from the
            // original array but transformed somehow
            const updatedCartItems = updatedCart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            })
            );
            await axios.put(import.meta.env.VITE_API_URL + '/api/cart', {
                cartItems: updatedCartItems
            }, {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            })

        } catch (e) {
            console.error("Error updating cart:", error);
        } finally {
            setIsLoading(false);
        }
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
        } else {

            modifyQuantity(existingCartItem.product_id, existingCartItem.quantity + 1)
        }
        updateCart(modifiedCart);
    }

    const modifyQuantity = (product_id, quantity) => {

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

        const cloned = cart.map(i => i.id !== clonedCartItem.id ? i : clonedCartItem)

        setCart(cloned)

    updateCart(modifiedCart);
    }

    const removeFromCart = (product_id) => {
        const existingCartItem = cart.find(i => i.product_id === product_id);
        const cloned = cart.filter(currentCartItem => currentCartItem.id !== existingCartItem.id)
        setCart(cloned);
        updateCart(modifiedCart);
    }

    const fetchCart = async () => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cart,
        addToCart,
        updateCart,
        modifyQuantity,
        removeFromCart,
        fetchCart
    }
}