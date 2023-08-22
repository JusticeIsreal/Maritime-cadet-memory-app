import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// firebase imports
import { db, storage } from "../../Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
function ProductForm() {
  const { data: session } = useSession();
  // GENERATE IMAGE REVIEW
  const filePickerRef1 = useRef<HTMLInputElement>("" || null);
  const [imageUrls, setImageUrls] = useState<any>([]); // Array to store image URLs
  // CONVERT ALL IMAGE FILE TO BASE 64 STRING AND CREATE PREVIEW

  // image 1
  const uploadFile1 = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cadets");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dd61rrbxs/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };
  const addImageToPost1 = async (e: ChangeEvent<any>) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = await uploadFile1(file);

      setImageUrls((prevUrls: any) => [...prevUrls, imageUrl]); // Add imageUrl to the array

      const reader = new FileReader();

      reader.readAsDataURL(file);
    }
  };

  // UPLOAD FORM DETAILS TO FIREBASE
  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any, e: any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const productDetails = {
      ...data,
      id: Date.now(),
      approve: "yes",
      posterId: (session?.user as { uid: string })?.uid,
      posterEmail: (session?.user as { email: string })?.email,
      timestamp: serverTimestamp(),
      image: imageUrls.length > 0 ? [...imageUrls] : null,
    };

    try {
      const colRef = collection(db, "memories");
      await addDoc(colRef, { ...productDetails });
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
    }

    reset();

    setLoading(false);
    setImageUrls([]);
  };

  const [showSliderForm, setShowSliderForm] = useState(false);
  const openForm = () => {
    setShowSliderForm(!showSliderForm);
  };

  const removeImageUrl = (e: any) => {
    e.preventDefault();
    const newArr = imageUrls.filter((img: string) => img !== e.target.src);
    setImageUrls(newArr);
  };
  return (
    <div>
      <button
        onClick={() => openForm()}
        style={{
          padding: "10px",
          color: "white",
          background: "#ea9319",
          height: "50px",
          margin: "20px",
          marginLeft: "10px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        {showSliderForm ? "close" : "upload banner image "}
      </button>
      {showSliderForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* PRODUCT PRICE */}
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter Product Name"
            {...register("productname", { required: true })}
          />
          {errors.productname && (
            <span
              className="errror-msg"
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "red",
              }}
            >
              Kindly Enter Product Name
            </span>
          )}
          {/* PRODUCT PRICE */}
          <label>Product Price</label>
          <input
            type="Number"
            placeholder="Enter Product Price"
            {...register("productprice", { required: true })}
          />
          {errors.productprice && (
            <span
              className="errror-msg"
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "red",
              }}
            >
              Kindly Enter Product Price
            </span>
          )}
          {/* PRODUCT OLD PRICE */}
          <label>Product Old Price</label>
          <input
            type="Number"
            placeholder="Enter Product Old Price"
            {...register("productoldprice")}
          />
          {/* PRODUCT NUMBER */}
          <label>Product Specs</label>
          <input
            type="text"
            placeholder="Enter Product Specs"
            {...register("productnumber", { required: true })}
          />
          {errors.productnumber && (
            <span
              className="errror-msg"
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "red",
              }}
            >
              Kindly Enter Product Specs
            </span>
          )}
          {/* PRODUCT CATEGORY */}
          <label>Product Category</label>
          <input
            type="text"
            placeholder="Enter Product Category"
            {...register("productcategory", { required: true })}
          />
          {errors.productcategory && (
            <span
              className="errror-msg"
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "red",
              }}
            >
              Kindly Enter Product Category
            </span>
          )}
          {/* PRODUCT CLASS */}
          <label>Product Class</label>
          <select {...register("productclass")}>
            <option value="">Select</option>
            <option value="promo">Promo</option>
            <option value="trending">Trending</option>
          </select>
          {/* PRODUCT DISCRIPTION */}
          <label>Product Description</label>
          <textarea
            // type="text"
            placeholder="Enter Product Description"
            {...register("productdescription", { required: true })}
          />
          {errors.productdescription && (
            <span
              className="errror-msg"
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "red",
              }}
            >
              Kindly Enter Product Description
            </span>
          )}
          {/* PRODUCT IMAGE*/}
          <label>Product Image</label>
          <p style={{ fontSize: "12px", fontStyle: "italic", color: "gray" }}>
            <span style={{ color: "red" }}>Note:</span> This images uploaded
            should be
            <span style={{ fontWeight: "bolder" }}>
              {" "}
              Potraite Dimension{" "}
            </span>{" "}
            with product item aligned to the center
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* IMAGE 1 */}
            <input
              className="file-input"
              type="file"
              placeholder="Enter Product Number"
              ref={filePickerRef1}
              onChange={addImageToPost1}
            />
            <div>
              {" "}
              {imageUrls?.map((img: string) => (
                <img
                  key={img}
                  src={img}
                  onClick={(e) => removeImageUrl(e)}
                  alt="img"
                  style={{
                    width: "50px",
                    height: "50px",
                    margin: "5px",
                    border: "1px solid gray",
                  }}
                />
              ))}
            </div>
          </div>
          <input
            type="submit"
            className="submit-btn"
            value={loading ? "Uploading..." : "Upload Product"}
          />
        </form>
      )}
    </div>
  );
}

export default ProductForm;
