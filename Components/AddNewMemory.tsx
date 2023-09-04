import { useSession } from "next-auth/react";
import React from "react";
import { FiPlus } from "react-icons/fi";

function AddNewMemory({}: // setPostTriger,
// setLoginTriger,
{
  // setPostTriger: any;
  // setLoginTriger: any;
}) {
  const { data: session } = useSession();

  const loginStatus = () => {
    if (session) {
      // setPostTriger(true);
      // setLoginTriger(false);
    } else {
      // setPostTriger(false);
      // setLoginTriger(true);
    }
  };
  return (
    <div className="post-memory" onClick={() => loginStatus()}>
      <FiPlus className="post-icon" />
      {/* <p>post a memory</p> */}
    </div>
  );
}

export default AddNewMemory;
