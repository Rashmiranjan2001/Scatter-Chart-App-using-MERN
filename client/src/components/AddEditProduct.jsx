import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProduct = ({ fetchProducts = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [label, setLabel] = useState("");
  const [xCoordinates, setxCoordinates] = useState("");
  const [yCoordinates, setyCoordinates] = useState("");

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setLabel(response.data.data[0].label);
      setxCoordinates(response.data.data[0].xCoordinates);
      setyCoordinates(response.data.data[0].yCoordinates);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      label,
      xCoordinates: Number(xCoordinates),
      yCoordinates: Number(yCoordinates),
    };

    if (id) {
      try {
        await axios.put(`/api/products/${id}`, newProduct);
        navigate("/products");
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      try {
        await axios.post("/api/products", newProduct);
        fetchProducts(); // Fetch products after adding a new product
        navigate("/products");
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="mx-auto p-6 bg-white rounded-lg shadow-md" style={{ width: '600px', marginTop: '-100px' }}>
          <h2 className="text-xl font-bold mb-6">{id ? "Edit" : "Add"} Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                Label
              </label>
              <input
                type="text"
                id="label"
                name="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="input-field"
                style={{ border: '1px solid black', display: 'inline-block', borderRadius: "6px" }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xCoordinates">
                x-coordinate
              </label>
              <input
                type="number"
                id="xCoordinates"
                name="xCoordinates"
                value={xCoordinates}
                onChange={(e) => setxCoordinates(e.target.value)}
                required
                className="input-field"
                style={{ border: '1px solid black', display: 'inline-block', borderRadius: "6px" }}

              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="yCoordinates">
                y-coordinate
              </label>
              <input
                type="number"
                id="yCoordinates"
                name="yCoordinates"
                value={yCoordinates}
                onChange={(e) => setyCoordinates(e.target.value)}
                required
                className="input-field"
                style={{ border: '1px solid black', display: 'inline-block', borderRadius: "6px" }}

              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
