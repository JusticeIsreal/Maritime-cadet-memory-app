import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsShare } from "react-icons/bs";

interface TypeProps {
  product: any[];
  dynamicBtn: string[];
  setCategory: any;
  addToFav: any;
  search: string;
}
function Products({
  search,
  product,
  dynamicBtn,
  setCategory,
  addToFav,
}: TypeProps) {
  const newProduct = product?.filter((item) => {
    if (item.data().productname === "") {
      return item;
    } else if (
      item.data().productname.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else {
      return "";
    }
  });

  return (
    <div className="product-session-con">
      <div className="product-main-con">
        {/* <h1>PRODUCTS</h1> */}
        <form>
          <label>Filter</label>
          <div>
            <select name="" id="" onChange={(e) => setCategory(e.target.value)}>
              {dynamicBtn?.map((category: string, index: number) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select name="" id="" onChange={(e) => setCategory(e.target.value)}>
              {dynamicBtn?.map((category: string, index: number) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </form>
        {/* PRODUCTS ARRAY */}

        <>
          {newProduct.length < 1 ? (
            <p>No image with Name: {search}</p>
          ) : (
            <div className="products-con">
              {newProduct.map(
                (product: {
                  id: number;
                  data: () => {
                    (): any;
                    new (): any;
                    image: any;
                    productname: any;
                    productprice: any;
                    productoldprice: any;
                  };
                }) => (
                  <Product
                    key={product.id}
                    id={product.id}
                    productimages={product.data().image}
                    productname={product.data().productname}
                    productprice={product.data().productprice}
                    productoldprice={product.data().productoldprice}
                    addToFav={addToFav}
                  />
                )
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default Products;

function Product({
  addToFav,
  id,
  productimages,
  productname,
  productprice,
  productoldprice,
}: {
  addToFav: any;
  id: any;
  productimages: any;
  productname: any;
  productprice: any;
  productoldprice: any;
}) {
  // percentage of peomo
  const priceDifference =
    parseFloat(productoldprice.toString()) -
    parseFloat(productprice.toString());

  const percentageDifference = Math.floor(
    (priceDifference / parseFloat(productoldprice.toString())) * 100
  );

  return (
    <div className="products">
      <div className="product-img">
        <p className="percentage-off">
          <span>
            <BsShare className="likenshareicon" />
          </span>
        </p>

        <Link href={`/ClientDynamic/${id}`}>
          <Image
            src={productimages[0]}
            alt="img"
            className="home-product-img"
            fill
            sizes="100vw"
          />
        </Link>
      </div>
      <Link
        href={`/ClientDynamic/${id}`}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <p className="product-name">{productname}</p>
      </Link>
      <div className="likenshare">
        <span>
          <AiOutlineHeart className="likenshareicon" />
          <b>2</b>
        </span>
        <span onClick={(e) => addToFav(e, id)}>
          <BiCommentDetail className="likenshareicon" />
          <b>2</b>
        </span>
      </div>
    </div>
  );
}