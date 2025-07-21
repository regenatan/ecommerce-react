import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useCart } from "./CartStore";
import { useLocation } from "wouter";

export default function ProductPage() {

    // store the products in a state
    const [products, setProducts] = useState([]);

    const {addToCart} = useCart();

    const [_, setLocation] = useLocation();
    
    useEffect(() => {
        const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }};

  fetchProducts();
}, []);



    const handleAddToCart = product=>{
        addToCart(product);
        setLocation('/cart');
    };

    const renderProducts = () => {
        const productJSX = [];
        for(let p of products) {
            productJSX.push(<div key={p.id} className="col-md-4 mb-4">
                <ProductCard
                    imageUrl={p.image}
                    price={p.price}
                    name={p.name}
                    onAddToCart={()=>{
                       handleAddToCart(p)
                    }}
                />
            </div>)
        }
        return productJSX;
    }

    return (<>
        <div className="container mt-5">
            <h1>Our Products</h1>
            <div className="row">
            {renderProducts()}
            </div>
        </div>
    </>)
}