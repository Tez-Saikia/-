import React, { useEffect, useState } from "react";
import "../../Fonts.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Aos from "aos";
import "aos/dist/aos.css";
import { footerImgs } from "./footerImgs/footerImgs.js";
import { FaLocationDot } from "react-icons/fa6";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Footer() {
  const currentUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ once: true, duration: 2000 });
  });

  const handleChatClick = (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast("Login first or create an account", {
        icon: "🔒",
      });
      navigate("/login");
      return;
    }

    navigate("/chat");
  };

  return (
    <>
      <div className="bg-[#181716] pt-3 pb-4">
        <h1 className="cinzel text-[#fff] custom-xsm:text-[1.3rem] sm:text-[1.5rem] custom-xsm:mt-3 lg:text-[1.8rem] text-center  leading-relaxed">
          Framing
        </h1>

        <div className="relative flex justify-center items-center custom-xsm:mt-2 gap-8 lg:gap-[7rem]">
          {/* Left Line */}
          <div className="absolute hidden lg:flex left-[25%] w-[1px] h-[190px] sm:h-[220px] lg:h-[350px] xl:h-[400px] bg-white/60 xl:top-[17rem]" />

          {/* Image */}
          <img
            className="custom-xsm:w-[12.5rem] sm:w-[14rem] lg:w-[16rem] lg:-mt-[3rem] xl:w-[20rem] xl:mt-[1rem]"
            src={footerImgs.Footer_1_Img}
            alt=""
          />

          {/* Right Line */}
          <div className="absolute hidden lg:flex right-[25%] w-[1px] h-[190px] sm:h-[220px] lg:h-[350px] xl:h-[400px] bg-white/60 xl:top-[17rem]" />
        </div>

        <div className="xl:mt-[4rem]">
          <h4 className="cinzel text-[#fff] custom-xsm:text-[.7rem] sm:text-[.9rem] custom-xsm:mt-3 text-center lg:-mt-[3rem] xl:text-[1rem]">
            Life's —— Finest —— Moments
          </h4>

          <h6 className="cinzel text-[#fff] custom-xsm:text-[.5rem] sm:text-[.7rem] custom-xsm:mt-2 text-center  xl:text-[.8rem]">
            Since 2017
          </h6>
        </div>

        <div className="mt-10 lg:flex lg:flex-col lg:items-start lg:pl-5 lg:-mt-[11rem] xl:-mt-[4rem]">
          <h1 className="cinzel text-[#fff] font-medium custom-xsm:text-[1.2rem] custom-xsm:mt-3 text-center lg:text-left xl:text-[1.5rem] leading-relaxed">
            Feeling Photography
          </h1>

          <h4 className="cinzel text-[#fff] font-thin custom-xsm:text-[.6rem] xl:text-[.8rem] custom-xsm:mt-1 text-center lg:text-left leading-relaxed">
            Premium photography FOR,
          </h4>

          <h4 className="cinzel text-[#fff] font-thin custom-xsm:text-[.6rem] xl:text-[.8rem] text-center lg:text-left leading-relaxed">
            everlasting stories of love.
          </h4>

          <div className="flex justify-center lg:justify-start items-center custom-xsm:mt-1 gap-1">
            <h4 className="cinzel text-[#fff] font-medium custom-xsm:text-[.7rem] xl:text-[.9rem] text-center lg:text-left leading-relaxed">
              tezpur
            </h4>

            <FaLocationDot className="text-[#fff] custom-xsm:text-[.7rem] xl:text-[.9rem]" />

            <h4 className="cinzel text-[#fff] font-medium custom-xsm:text-[.7rem] xl:text-[.9rem] text-center lg:text-left leading-relaxed">
              Assam
            </h4>
          </div>
        </div>

        <div className="mt-10 lg:flex lg:flex-col lg:items-end lg:pr-5 lg:-mt-[5.5rem] xl:-mt-[7rem]">
          <h1 className="cinzel text-[#fff] font-medium custom-xsm:text-[1.2rem] xl:text-[1.5rem] custom-xsm:mt-3 text-center leading-relaxed lg:pr-9 xl:pr-16">
            Explore
          </h1>

          {/* Links Section */}
          <div className="flex items-center justify-center gap-8  mt-2 xl:pr-8">
            {/* Column 1 */}
            <ul className="text-white space-y-2 custom-xsm:text-[.8rem] xl:text-[.8rem] cinzel text-center">
              <li className="cursor-pointer">
                <a href="/">HOME</a>
              </li>
              <li className="cursor-pointer">
                <a href="/gallery">GALLERY</a>
              </li>
              <li className="cursor-pointer">
                <a href="/about">ABOUT</a>
              </li>
            </ul>

            {/* Column 2 */}
            <ul className="text-white space-y-2 custom-xsm:text-[.8rem] xl:text-[.8rem] cinzel text-center">
              <li className="cursor-pointer">
                <a href="/faqs">FAQs</a>
              </li>
              <li className="cursor-pointer">
                <a href="/blog">BLOGS</a>
              </li>

              <li className="flex items-center justify-center gap-2 text-[1rem]">
                <button onClick={handleChatClick}>
                  <IoChatbubbleEllipsesSharp className="hover:text-green-400 transition duration-300 cursor-pointer" />
                </button>

                <a
                  href="https://www.facebook.com/rahul.das.357?mibextid=UuH66acrLgeVUPia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="hover:text-blue-500 transition duration-300 cursor-pointer" />
                </a>

                <a
                  href="https://www.instagram.com/Rahul.das_photography"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="hover:text-pink-500 transition duration-300 cursor-pointer" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-[.6px] border-white border-opacity-5 mt-6 lg:mt-[5rem] xl:mt-[14rem]">
          <h3 className="font-alegreya text-[#fff] font-medium custom-xsm:text-[.5rem] sm:text-[.7rem] xl:text-[.9rem] custom-xsm:mt-3 text-center  leading-relaxed flex justify-center gap-2">
            <span>copyright © 2026 Feeling photography</span>
            <span>|</span>
            <span>Website by Tez Saikia</span>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Footer;
