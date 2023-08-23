import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ImCancelCircle } from "react-icons/im";

const emoji =
  "https://res.cloudinary.com/isreal/image/upload/v1681808231/downloai-removebg-preview_qgmagz.png";

function Modal({ setLoginTriger }: { setLoginTriger: any }) {
  // GO BACK

  const closeModal = () => {
    setLoginTriger(false);
    // setPayTriger(false);
  };
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <button onClick={() => closeModal()} className="go-back">
            <ImCancelCircle />
          </button>
          <div className="modal-img-con">
            {emoji ? (
              <img src="/undraw_Access_account_re_8spm (1).png" alt="" />
            ) : (
              <img src="/downloai.jpeg" alt="" />
            )}
          </div>
          <div className="modal-text">
            <p> To access this Function you need to sign in</p>{" "}
            <p className="modal-link" onClick={() => signIn()}>
              Sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
