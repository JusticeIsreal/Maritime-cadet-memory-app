import axios from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import { useRouter } from "next/router";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TiArrowBack } from "react-icons/ti";
import { db } from "../Firebase";
// //////////////////////////

import { useForm as mantineform } from "@mantine/form";
import {
  TextInput,
  Switch,
  Group,
  ActionIcon,
  Box,
  Text,
  Button,
  Code,
  Textarea,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { IconTrash } from "@tabler/icons-react";
function AddMemoryModal({ setPostTriger }: { setPostTriger: any }) {
  // GO BACK
  const { data: session } = useSession();
  const closeModal = () => {
    setPostTriger(false);
    // setPayTriger(false);
  };
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

  // //////////////////////////////////
  const form = mantineform({
    initialValues: {
      employees: [{ name: "", active: false, key: randomId() }],
    },
  });
  console.log(form.values.employees);
  const fields = form.values.employees.map((item, index) => (
    <Group key={item.key} mt="xs" className="mantine-group">
      <Textarea
        placeholder="Tell us about this picture(s)"
        withAsterisk
        sx={{ flex: 1 }}
        {...form.getInputProps(`employees.${index}.name`)}
      />
      <ActionIcon
        className="remove-input-icon"
        color="red"
        onClick={() => form.removeListItem("employees", index)}
      >
        <RiDeleteBin6Line className="Box" />
      </ActionIcon>
    </Group>
  ));

  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <button onClick={() => closeModal()} className="go-back-form">
            <TiArrowBack />
            Back
          </button>
          <h3>Share those amazing memories in pictures</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* PICTURE NAME(s) */}
            <input
              type="text"
              placeholder="Who is in the picture(s) ?"
              {...register("namesonpicture", { required: true })}
            />
            {errors.namesonpicture && (
              <span
                className="errror-msg"
                style={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "red",
                }}
              >
                Kindly enter names in picture
              </span>
            )}
            {/* PICTURE LOCATION */}
            <input
              type="text"
              placeholder="Where was picture(s) taken ?"
              {...register("picturelocation", { required: true })}
            />
            {errors.picturelocation && (
              <span
                className="errror-msg"
                style={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "red",
                }}
              >
                Kindly enter this location
              </span>
            )}
            {/* year */}
            <input
              type="Number"
              placeholder="What year was this ?"
              {...register("pictureyear", { required: true })}
            />
            {errors.pictureyear && (
              <span
                className="errror-msg"
                style={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "red",
                }}
              >
                Kindly enter year for this picture
              </span>
            )}
            {/* memory */}
            <Box maw={500} mx="auto" className="Box">
              {fields}

              <Group mt="md" className="add-new-input">
                <p
                  onClick={() =>
                    form.insertListItem("employees", {
                      name: "",
                    })
                  }
                >
                  Click here to add new paragraph
                </p>
              </Group>
            </Box>
            {/* PRODUCT DISCRIPTION */}

            <p
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "gray",
                width: "90%",
                marginTop: "20px",
              }}
            >
              <span style={{ color: "red" }}>Note:</span> select
              <span style={{ fontWeight: "bolder" }}>
                {" "}
                ONE IMAGE AT A TIME BEFORE POSTING{" "}
              </span>{" "}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {/* IMAGE 1 */}
              <input
                className="file-input"
                type="file"
                ref={filePickerRef1}
                onChange={addImageToPost1}
              />
              <div className="selectedImg">
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
              value={
                loading
                  ? "POSTING..."
                  : `POST WITH ${
                      imageUrls?.length > 0
                        ? imageUrls?.length
                        : imageUrls?.length
                    } ${imageUrls?.length > 1 ? "IMAGES" : "IMAGE"}`
              }
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemoryModal;
