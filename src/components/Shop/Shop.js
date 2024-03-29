import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  addToDb,
  deleteShoppingCart,
  getStoredCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  // const { products, count } = useLoaderData();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const pages = Math.ceil(count / size);

  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${page}&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setCount(data.count);
      });
  }, [page, size]);

  const clearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  useEffect(() => {
    const storedCart = getStoredCart();
    const savedCart = [];
    for (const id in storedCart) {
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        savedCart.push(addedProduct);
      }
    }
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (selectedProduct) => {
    console.log(selectedProduct);
    let newCart = [];
    const exists = cart.find((product) => product._id === selectedProduct._id);
    if (!exists) {
      selectedProduct.quantity = 1;
      newCart = [...cart, selectedProduct];
    } else {
      const rest = cart.filter(
        (product) => product._id !== selectedProduct._id
      );
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, exists];
    }
    setCart(newCart);
    addToDb(selectedProduct._id);
  };

  return (
    <div>
      <div className="shop-container">
        <div className="products-container">
          {products.map((product) => (
            <Link className="Link" to={`/products/${product._id}`}>
              <Product
                className="product"
                key={product._id}
                product={product}
                handleAddToCart={handleAddToCart}
              ></Product>
            </Link>
          ))}
        </div>
        <div className="cart-container">
          <Cart clearCart={clearCart} cart={cart}>
            <Link to="/orders">
              <button>Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <p>Now your are page no {page + 1}</p>
        {[...Array(pages).keys()].map((number) => {
          return (
            <button
              className={page === number && "selected"}
              key={number}
              onClick={() => setPage(number)}
            >
              {number + 1}
            </button>
          );
        })}
        <select className="" name="" id="" onChange={event => setSize(event.target.value)}>
          <option value="5">5</option>
          <option value="10" selected>10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};
export default Shop;
