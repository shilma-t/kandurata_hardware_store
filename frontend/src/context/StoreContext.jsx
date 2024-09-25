// StoreContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [featuredProducts, setFeaturedProducts] = useState([]); // This will hold your fetched products
    const url = "http://localhost:5001";
    const [token, setToken] = useState("");

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    };

      // Fetch product list from the API and store in `featuredProducts`
      const fetchProductList = async () => {
        try {
            const response = await axios.get(url + "/api/product/list");
            setFeaturedProducts(response.data.data); // Update with fetched data
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    const loadCartData =async (token)=>{
        const response =await axios.post(url+"/api/cart/get",{},{headers:{token}});

        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);

  
    // Function to calculate total cart amount
    const getTotalCartAmount = () => {
        return Object.keys(cartItems).reduce((total, itemId) => {
            const product = featuredProducts.find(product => product._id === itemId); // Adjust based on your product structure
            if (product) {
                return total + product.retailPrice * cartItems[itemId]; // Assuming each product has a `price` field
            }
            return total;
        }, 0);
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        url,
        token,
        setToken,
        featuredProducts ,// Correctly store fetched products here
        getTotalCartAmount, // Add the function to context
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
