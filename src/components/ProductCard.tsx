import React from 'react'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import Button from './Button'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <article className="card product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-body">
        <p className="eyebrow-light">{product.category}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>${product.price.toLocaleString('es-CO')}</strong>
          <Button onClick={() => addItem(product)} variant="primary" className="icon-btn">
            <ShoppingBag size={16} /> Añadir
          </Button>
        </div>
      </div>
    </article>
  )
}
