import React, {useState} from 'react';
import './App.css';
import ProductCard from './ProductCard';
import Navbar from './Navbar';
import HomePage from './Homepage';
import ProductsPage from './ProductsPage';
import RegisterPage from './RegisterPage';
import { Route, Switch } from 'wouter';
import ShoppingCart from './ShoppingCart';
import FlashMessage from "./FlashMessage";
import UserLogin from "./UserLogin";
import Profile from "./Profile";

function App() {

    const [isNavbarShowing, setNavbarShowing] = useState(false); 

    // Toggle the collapse state
    const toggleNavbar = () => {
      setNavbarShowing(!isNavbarShowing);
    };

  return (
  <>
  <Navbar/>
   <FlashMessage/>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/cart" component={ShoppingCart} />
        <Route path="/login" component={UserLogin} />
        <Route path="/profile" component={Profile} />
      </Switch>

<footer className="bg-dark text-white text-center py-3">
  <div className="container">
    <p>&copy; 2023 E-Shop. All rights reserved.</p>
  </div>
</footer>

  </>);
}

export default App;