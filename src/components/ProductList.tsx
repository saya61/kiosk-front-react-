import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface ProductListProps {
    category: string;
    onProductClick: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ category, onProductClick }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        console.log(`Fetching products for category: ${category}`);
        axios.get(`http://localhost:8080/api/products/category/${category}`)
            .then(response => {
                console.log('Response data:', response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, [category]);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductClick(product)}
                />
            ))}
        </div>
    );
}

export default ProductList;
