import React from "react";
import ProductForm from "../features/admin/components/ProductForm";
import Navbar from "../features/navbar/Navbar";

export default function AdminProductForm() {
  return (

    <div><Navbar/>
      <ProductForm />
      {/* form for add new products  */}
    </div>
  );
}
