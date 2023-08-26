import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { db } from "../Firebase";
function EditProfile() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any, e: any) => {
    e.preventDefault();

    // if (loading) return;
    // setLoading(true);
    const productDetails = {
      ...data,
      id: Date.now(),
    };

    reset();
    // setLoading(false);
    // setImageUrls([]);
  };

  // get array of years
  const yearStart = Array.from({ length: 2023 - 1979 + 1 }, (_, index) =>
    index === 0 ? "start" : 1979 + index
  );
  const yearEnd = Array.from({ length: 2023 - 1979 + 1 }, (_, index) =>
    index === 0 ? "Finish" : 1979 + index
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
      <input
        type="number"
        placeholder="Enter phone number"
        {...register("phone_number")}
      />
      <select {...register("department")}>
        <option value="" key="">
          Your department
        </option>
        <option value="ME" key="">
          ME
        </option>
        <option value=" NS" key="">
          NS
        </option>
        <option value="EE" key="">
          EE
        </option>
        <option value="HYD" key="">
          HYD
        </option>
        <option value="MET" key="">
          MET
        </option>
        <option value="MTBS" key="">
          MTBS
        </option>
        <option value="MTBM" key="">
          MTBM
        </option>
      </select>
      {/* department */}
      <div className="select-con">
        <div>
          <select {...register("startyear")}>
            {yearStart?.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
          <select {...register("endyear")}>
            {yearEnd?.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input type="submit" />
    </form>
  );
}

export default EditProfile;
