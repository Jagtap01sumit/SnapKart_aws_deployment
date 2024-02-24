import React from "react";
import Navbar from "../features/navbar/Navbar";
import ProductList from "../features/product-list/components/ProductList";
import { Link } from "react-router-dom";
import Footer from "../features/common/Footer";
export default function Home() {
  return (
    <div>
      <Navbar />
      <ProductList />
      <Footer/>
     
    </div>
  );
}
