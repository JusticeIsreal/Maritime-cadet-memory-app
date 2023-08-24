import axios from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TiArrowBack } from "react-icons/ti";
import { db } from "../Firebase";
import { useForm as mantineform } from "@mantine/form";
import { Group, ActionIcon, Box, Textarea } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";

function AddMemoryModal({ setPostTriger }: { setPostTriger: any }) {
  // MANTINE NESTED FORM CONFIG
  const form = mantineform({
    initialValues: {
      employees: [{ name: "", active: false, key: randomId() }],
    },
  });

  const fields = form.values.employees.map((item, index) => (
    <Group key={item.key} mt="xs" className="mantine-group">
      <Textarea
        placeholder="Story behind these pictures? (optional)"
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
  // END MANTINE NESTED FORM CONFIG

  // GET NEXT AUTH USER SESSION
  const { data: session } = useSession();

  // CLOSR MODAL
  const closeModal = () => {
    setPostTriger(false);
  };

  // GENERATE IMAGE REVIEW
  const filePickerRef1 = useRef<HTMLInputElement>("" || null);
  const [imageUrls, setImageUrls] = useState<any>([]); // Array to store image URLs

  // CONVERT ALL IMAGE FILE TO BASE 64 STRING AND CREATE PREVIEW
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
      approve: "no",
      message: [...form.values.employees],
      posterId: (session?.user as { uid: string })?.uid,
      posterEmail: (session?.user as { email: string })?.email,
      timestamp: serverTimestamp(),
      image: imageUrls.length > 0 ? [...imageUrls] : null,
    };

    try {
      const colRef = collection(db, "memories");
      await addDoc(colRef, { ...productDetails });
      alert("Product added successfully!");
      setPostTriger(false);
    } catch (error) {
      console.error(error);
    }

    reset();
    setLoading(false);
    setImageUrls([]);
  };

  // REMOVE SELECTED IMAGE BEFORE POSTING
  const removeImageUrl = (e: any) => {
    e.preventDefault();
    const newArr = imageUrls.filter((img: string) => img !== e.target.src);
    setImageUrls(newArr);
  };

  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <button onClick={() => closeModal()} className="go-back-form">
            <ImCancelCircle />
          </button>
          <h3>Share those amazing memories in pictures</h3>

          <div className="form-con">
            {" "}
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <span style={{ fontWeight: "bolder", fontSize: "11px" }}>
                  {" "}
                  ONE IMAGE AT A TIME BEFORE POSTING{" "}
                </span>{" "}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {/* IMAGEs */}
                <input
                  className="file-input"
                  type="file"
                  ref={filePickerRef1}
                  onChange={addImageToPost1}
                />
                <div className="selectedImg">
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
              {/* department */}
              <select {...register("department", { required: true })}>
                <option value="">What department ?</option>
                <option value="Mixed">Mixed</option>
                <option value="Marine">Marine Engineering</option>
                <option value="Nautical">Nautical Science</option>
                <option value="Management">Management</option>
                <option value="Elect/Elect">Elect/Elect</option>
                <option value="Hydro/Metro">Hydro/Metro</option>
              </select>
              {errors.department && (
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
              {imageUrls.length > 0 ? (
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
              ) : (
                <input
                  style={{ textAlign: "center" }}
                  onClick={() => alert("Kindly add pictures")}
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
              )}{" "}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMemoryModal;
