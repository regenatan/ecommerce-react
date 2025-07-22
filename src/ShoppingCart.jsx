import axios from "axios";
import { useCart } from "./CartStore";
import { useEffect } from "react";
import { useJwt } from "./UserStore";


export default function ShoppingCartPage() {

    const { cart, modifyQuantity, removeFromCart, fetchCart } = useCart();
    const { getJwt } = useJwt();

    useEffect(() => {
        fetchCart();
    }, []);

    const checkout = async () => {
        const jwt = getJwt();
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/checkout', {}, {
            headers: {
                Authorization: "Bearer " + jwt
            }
        });
        window.location = response.data.url;
    }

    return (<>
        <div className="container">
            <h1>Shopping Cart</h1>
            <ul className="list-group mb-3">
                {

                    cart.map(item => (
                        <li className="list-group-item d-flex justify-content-between" key={item.id}>
                            <div>
                                <h5>{item.product_name}</h5>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-primary btn-sm"
                                        onClick={() => modifyQuantity(item.product_id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                    >-</button>
                                    <p className="mb-0 ms-1 me-1">Quantity: {item.quantity}</p>
                                    <button className="btn btn-primary btn-sm"
                                        onClick={() => modifyQuantity(item.product_id, item.quantity + 1)}
                                    >+</button>
                                    <div>
                                        <button className="btn btn-danger btn-sm ms-1"
                                            onClick={() => {
                                                removeFromCart(item.product_id)
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <img src={item.image_url} />
                            </div>

                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))

                }

            </ul>
        </div>

    </>)
}