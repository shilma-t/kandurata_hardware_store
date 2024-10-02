import React, { useContext, useState, useEffect } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import { StoreContext } from '../../context/StoreContext';
import Footer from '../../components/Footer/Footer';


const Home = () => {
    const [category, setCategory] = useState("All");
    const { featuredProducts } = useContext(StoreContext);

    // Filter products based on the selected category
    const filteredProducts = category === "All"
        ? featuredProducts
        : featuredProducts.filter(product => product.category === category);

        return (
            <div>
                <Header />
                <ExploreMenu category={category} setCategory={setCategory} />
                <ProductDisplay category={category} products={filteredProducts} />
                <Footer /> {/* Ensure Footer is added here */}
            </div>
        );
        
}

export default Home;
