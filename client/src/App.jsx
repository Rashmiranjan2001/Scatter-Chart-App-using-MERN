import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";
import UserList from "./components/UserList";
import ProductList from "./components/ProductList";
import AddEditProduct from "./components/AddEditProduct";
import AddEditUser from "./components/AddEditUser";

const NavbarLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="mr-4">
      <Link
        to={to}
        className={`px-2 py-1 rounded ${
          isActive ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
        }`}
      >
        {children}
      </Link>
    </div>
  );
};

const Home = () => (
  <div className="flex-1 overflow-y-auto">
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-600"style={{marginTop: '-60px' }}>
      <div className="text-center text-white"> {/* Adjust margin top */}
        <h1 className="text-5xl font-bold mb-8">
          Welcome to Scatter Chart Web App
        </h1>
        <p className="text-lg mb-12">Visualize your data with elegance.</p>
      </div>
      <Link
        to="/add-product"
        className="bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Get Started
      </Link>
      <div className="absolute bottom-0 left-0 right-0 text-white text-center mb-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Scatter Chart App. All rights
          reserved.
          <br />
          Created by Rashmiranjan Rout
        </p>
      </div>
    </div>
  </div>
);


const App = () => {
  // State and useEffect hooks
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  axios.defaults.baseURL = `http://localhost:5001`;

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers(); // Fetch users after deleting a user
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts(); // Fetch products after deleting a product
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="mx-auto app h-screen flex flex-col">
      <Router>
        <div className="flex flex-row bg-blue-900 py-4 px-4 justify-between align-middle items-center">
          <h1 className="text-3xl font-bold text-white">SCATTER CHART </h1>
          <div className="flex">
            <NavbarLink to="/">Home</NavbarLink>
            <NavbarLink to="/add-product">Add Products</NavbarLink>
            <NavbarLink to="/products">Products</NavbarLink>
          </div>
        </div>
        <div className="flex-1">
          <Routes>
          <Route
              path="/"
              element={
                  <Home
                  />
              }
            />
            <Route
              path="/users"
              element={
                <div className="mx-auto w-1/2 place-self-center mt-20 place-content-center self-center place-items-center">
                  <UserList
                    users={users}
                    fetchUsers={fetchUsers}
                    deleteUser={deleteUser}
                  />
                </div>
              }
            />
            <Route
              path="/products"
              element={
                <div className="mx-auto w-1/2 place-self-center mt-20 place-content-center self-center place-items-center">
                  <ProductList
                    products={products}
                    fetchProducts={fetchProducts}
                    deleteProduct={deleteProduct}
                  />
                </div>
              }
            />
            <Route
              path="/add-product"
              element={
                  <AddEditProduct fetchProducts={fetchProducts} />
              }
            />
            <Route
              path="/add-user"
              element={
                <div className="mx-auto w-1/2 place-self-center mt-20 place-content-center self-center place-items-center">
                  <AddEditUser fetchUsers={fetchProducts} />
                </div>
              }
            />
            <Route
              path="/edit-product/:id"
              element={
                  <AddEditProduct fetchProducts={fetchProducts} />
              }
            />
            <Route
              path="/edit-user/:id"
              element={
                <div className="mx-auto w-1/2 place-self-center mt-20 place-content-center self-center place-items-center">
                  <AddEditUser fetchUsers={fetchProducts} />
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
