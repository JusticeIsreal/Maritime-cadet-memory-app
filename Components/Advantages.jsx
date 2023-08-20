import Image from "next/image";
import React from "react";

function Advantages() {
  return (
    <div className="advantage-main-con">
      <div className="advantage-con">
        <div className="advantage-img-con">
          <Image
            src="https://res.cloudinary.com/dntjkmkov/image/upload/v1685790878/undraw_On_the_way_re_swjt__1_-removebg-preview_gxgqg2.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Fast delivery</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="https://res.cloudinary.com/dntjkmkov/image/upload/v1685790879/undraw_Stripe_payments_re_chlm__1_-removebg-preview_u04k3m.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Safe Checkout</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="https://res.cloudinary.com/dntjkmkov/image/upload/v1685790883/undraw_Access_account_re_8spm__2_-removebg-preview_x9sftd.png"
            alt="img"
            width={50}
            className="img"
            height={50}
          />
          <p>24/7 active</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="https://res.cloudinary.com/dntjkmkov/image/upload/v1685790886/undraw_shopping_app_flsj__1_-removebg-preview_wegnra.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Fast delivery</p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
