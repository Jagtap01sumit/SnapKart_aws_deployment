import React from 'react'
import ProductDetails from '../features/product-list/components/ProductDetails'
import Navbar from '../features/navbar/Navbar'
import Footer from '../features/common/Footer'

export default function ProductDetailPage() {
  return (
    <div><Navbar/>
    <ProductDetails/>
    <Footer/></div>
  )
}
