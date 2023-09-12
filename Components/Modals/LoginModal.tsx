import { signIn } from "next-auth/react";
import React from "react";
import { GiStopSign } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";

function LoginModal({ setLoginTriger }: { setLoginTriger: any }) {
  // GO BACK
  const closeModal = () => {
    setLoginTriger(false);
  };
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <span onClick={() => closeModal()} className="go-back-login">
            <MdOutlineClose className="login-close-icon" />
          </span>
          <div className="modal-text">
            {/* <GiStopSign className="login-stop-icon" /> */}
            <p>Sig in to continue</p>
            <button className="modal-link" onClick={() => signIn()}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
