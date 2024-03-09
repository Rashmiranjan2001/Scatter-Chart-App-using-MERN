import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Link, useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductList = ({ products, deleteProduct, fetchProducts }) => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const editProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    if (products.length > 0) {
      renderChart(products);
    }
    return () => {
      destroyChart();
    };
  }, [products]);

  const renderChart = (productsData) => {
    const labels = productsData.map((product) => product.label);
    const xValues = productsData.map((product) => product.xCoordinates);
    const yValues = productsData.map((product) => product.yCoordinates);
  
    const ctx = chartRef.current.getContext("2d");
  
    if (chartInstanceRef.current) {
      destroyChart(); // Destroy existing chart instance
    }
  
    const newChartInstance = new Chart(ctx, {
      type: "scatter",
      data: {
        labels: labels, // Corrected: Using labels as labels, not xCoordinates
        datasets: [
          {
            label: "Products",
            data: labels.map((label, index) => ({
              x: xValues[index], // Corrected: Using xCoordinates as x values
              y: yValues[index], // Corrected: Using yCoordinates as y values
              productId: productsData[index]._id,
            })),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "x-coordinate",
            },
          },
          y: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "y-coordinate",
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElement = elements[0];
            const clickedIndex = clickedElement.index;
            const product = productsData[clickedIndex];
            setSelectedProduct(product);
            setPopupIsOpen(true);
          }
        },
      },
    });
  
    chartInstanceRef.current = newChartInstance;
  };
  

  const destroyChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  };

  const handleUpdateProduct = () => {
    editProduct(selectedProduct._id);
    setPopupIsOpen(false);
  };

  const handleDeleteProduct = () => {
    deleteProduct(selectedProduct._id);
    setPopupIsOpen(false);
  };

  return (
    <div>
      <div className="justify-between flex">
        <h2 className="text-xl font-bold mb-2">Product List</h2>
        <Link
          to="/add-product"
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add Product
        </Link>
      </div>
      <div>
        <canvas ref={chartRef}></canvas>
      </div>
      {popupIsOpen && (
        <div className="popup-container">
          <div className="popup">
            <h2>Do you want to update or delete "{selectedProduct?.name}"?</h2>
            <button className="modal-button blue" onClick={handleUpdateProduct}>
              Update
            </button>
            <button className="modal-button red" onClick={handleDeleteProduct}>
              Delete
            </button>
            <button
              className="modal-button"
              onClick={() => setPopupIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
