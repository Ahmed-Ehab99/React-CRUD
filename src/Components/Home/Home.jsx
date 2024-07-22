import React, { useState, useEffect } from "react";
import "./HomeStyle.css";
import axios from "axios";
import swal from "sweetalert";

export default function Home() {
  let [pName, setPName] = useState("");
  let [pPrice, setPPrice] = useState("");
  let [pcateg, setPCateg] = useState("");
  let [pDesc, setPDesc] = useState("");
  let [pCount, setPCount] = useState("");
  let [api, setApi] = useState([]);
  let [editing, setEditing] = useState(false);
  let [currentProduct, setCurrentProduct] = useState(null);
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productCategInput = document.getElementById("productCateg");
  const productDescInput = document.getElementById("productDesc");
  const productCountInput = document.getElementById("productCount");
  async function getApi() {
    let { data } = await axios.get("http://localhost:3031/products");
    setApi(data);
  }
  useEffect(() => {
    getApi();
  }, []);
  async function deleteProduct(product) {
    if (product.count <= 1) {
      swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover "${product.name}" item!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          swal(`Poof! "${product.name}" deleted!`, {
            icon: "success",
          });
          await axios.delete(`http://localhost:3031/products/${product.id}`);
          getApi();
        } else {
          swal(`"${product.name}" is safe!`);
        }
      });
    } else {
      await axios.put(`http://localhost:3031/products/${product.id}`, {
        ...product,
        count: product.count - 1,
      });
      getApi();
    }
  }
  const deleteAll = async () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:3031/products`);
          setApi([]);
          swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",
          });
        } catch (error) {
          if (error.response.status === 404) {
            swal("Error: API endpoint not found!", {
              icon: "error",
            });
          } else {
            swal("Error: Something went wrong!", {
              icon: "error",
            });
          }
        }
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };
  function formSubmit(e) {
    e.preventDefault();
    if (editing) {
      editProduct(currentProduct.id);
      clearValue();
    } else {
      if (e.target.id === "deleteAll") {
        deleteAll();
      } else if (
        pName !== "" &&
        pPrice !== "" &&
        pcateg !== "" &&
        pDesc !== "" &&
        pCount !== ""
      ) {
        swal("Good job!", "You clicked the button!", "success").then(
          async (willAdd) => {
            if (willAdd) {
              await axios.post("http://localhost:3031/products", {
                name: pName,
                price: pPrice,
                category: pcateg,
                description: pDesc,
                count: pCount,
              });
              window.location.reload();
            }
          }
        );
      } else {
        swal("There's Empty Input Fields!");
        clearValue();
      }
    }
  }
  async function editProduct(id) {
    await axios.put(`http://localhost:3031/products/${id}`, {
      name: pName,
      price: pPrice,
      category: pcateg,
      description: pDesc,
      count: pCount,
    });
    setEditing(false);
    getApi();
  }
  const handleEdit = (product) => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    setEditing(true);
    setCurrentProduct(product);
    setPName(product.name);
    setPPrice(product.price);
    setPCateg(product.category);
    setPDesc(product.description);
    setPCount(product.count);
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    productCategInput.value = product.category;
    productDescInput.value = product.description;
    productCountInput.value = product.count;
  };
  function clearValue() {
    productNameInput.value = "";
    productPriceInput.value = "";
    productCategInput.value = "";
    productDescInput.value = "";
    productCountInput.value = "";
  }
  return (
    <section className="py-4">
      <div className="container">
        <h1 className="my-3">Prodect</h1>
        <form onSubmit={formSubmit}>
          <div className="mb-4">
            <label htmlFor="prodectName">prodect Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              id="productName"
              onChange={(e) => setPName(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="w-25">
              <label htmlFor="productPrice">Product Price</label>
              <input
                className="form-control"
                type="number"
                placeholder="Price"
                id="productPrice"
                onChange={(e) => setPPrice(e.target.value)}
              />
            </div>
            <div className="w-50">
              <label htmlFor="productCateg">Product Category</label>
              <input
                className="form-control"
                type="text"
                placeholder="Category"
                id="productCateg"
                onChange={(e) => setPCateg(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="productDesc">Product Description</label>
            <input
              className="form-control"
              type="text"
              placeholder="Description"
              id="productDesc"
              onChange={(e) => setPDesc(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="w-25">
              <label htmlFor="productCount">Product Count</label>
              <input
                className="form-control"
                type="number"
                placeholder="Count"
                id="productCount"
                onChange={(e) => setPCount(e.target.value)}
              />
            </div>
            <div className="w-50">
              <label htmlFor="search">Search About Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Search"
                id="search"
              />
            </div>
          </div>
          <button
            className="btn btn-secondary me-1"
            id="submit"
            type="submit"
            onClick={formSubmit}
          >
            {editing ? "Update Product" : "Add Product"}
          </button>
          <button
            className="btn btn-danger"
            id="deleteAll"
            onClick={(e) => {
              e.preventDefault();
              deleteAll();
            }}
          >
            Delete All
          </button>
        </form>
        <table className="w-100 mt-5 text-center table-bordered">
          <thead>
            <tr>
              <th>NO.</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Categ.</th>
              <th>Product Desc.</th>
              <th>Count</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {api.map((products, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{products.name}</td>
                <td>{products.price}</td>
                <td>{products.category}</td>
                <td>{products.description}</td>
                <td>{products.count}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(products)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(products)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
