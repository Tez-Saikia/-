import React, { useEffect } from "react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import AboutImg from "./AboutImg/AboutImg.png";
import "../../Fonts.css";
import Aos from "aos";
import "aos/dist/aos.css";
import LOGO from "../../assets/LOGO.png";

function About() {
  useEffect(() => {
    Aos.init({ once: true, duration: 2000 });
  });
  return (
    <div className="bg-[#181716]">
      <Nav />

      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-10 lg:hidden">
        <img src={LOGO} alt="" className="custom-xsm:w-[8rem] " />
      </div>

      <div className="pt-[10rem] lg:hidden">
        <div className="flex justify-center">
          <img
            className="rounded-lg custom-xsm:w-[14rem] custom-ssm:w-[17rem] sm:w-[20rem] md:w-[21rem]"
            src={AboutImg}
            alt=""
            data-aos="fade-up"
            data-aos-duration="3000"
          />
        </div>

        <h1
          className="text-center cinzel text-[#fff] pt-[4rem] pb-8 custom-xsm:text-4xl sm:text-5xl lg:text-[3.9rem]"
          data-aos="fade-up"
        >
          ABOUT US
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-start mt-7 lg:p-6 pb-2 sm:px-8">
          <div className="w-full lg:w-1/2 pt-11 px-2 gap-12 text-center lg:text-left lg:-mt-5 lg:pl-8 custom-xxl:-mt-7 2xl:mt-5">
            <h1
              className="text-[#fff] custom-xsm:text-[1.3rem] sm:text-2xl custom-xxl:text- lg:text-4xl cinzel pb-5"
              data-aos="fade-up"
            >
              Feeling Photography - Crafting memories since 2017
            </h1>
            <p
              className=" cinzel text-[#fff] text-[.8rem] sm:text-sm custom-xsm:text-xs lg:text-xl xl:text-[1.4rem] xl:pt-10  custom-xxl:text-2xl custom-xsm:pt-9 custom-xxl:pt-10 lg:-mt-7 "
              data-aos="fade-up"
            >
              What started as a passion for freezing fleeting moments slowly
              turned into something deeper. A desire to preserve stories. The
              quiet glances. The loud laughter. The in-between moments that
              often go unnoticed.
            </p>
            <p
              className="cinzel text-[#fff] text-[.8rem] sm:text-sm custom-xsm:text-xs lg:text-xl font-normal pt-8 tracking-wider xl:text-[1.4rem] xl:pt-6 custom-xxl:text-2xl custom-xsm:pt-9 custom-xxl:pt-10"
              data-aos="fade-up"
            >
              The name Feeling Photography represents exactly that — not just
              images, but feelings you can return to.
            </p>
            <p
              className="cinzel text-[#fff] text-[.8rem] sm:text-sm custom-xsm:text-xs  lg:text-lg font-normal pt-8 tracking-wider xl:text-[1.4rem] xl:pt-6 custom-xsm:pt-9 custom-xxl:text-2xl custom-xxl:pt-10"
              data-aos="fade-up"
            >
              From intimate weddings to vibrant celebrations, from heartfelt
              family gatherings to professional events, every frame is
              approached with intention and care. We focus on authenticity over
              perfection, emotion over pose.
            </p>

            <p
              className="cinzel text-[#fff] text-[.8rem] sm:text-sm custom-xsm:text-xs  lg:text-lg font-normal pt-8 tracking-wider xl:text-[1.4rem] xl:pt-6 custom-xsm:pt-9 custom-xxl:text-2xl custom-xxl:pt-10"
              data-aos="fade-up"
            >
              Behind the lens is a storyteller who believes that every person,
              every couple, every celebration carries a unique rhythm. Our job
              is simply to translate that rhythm into timeless visuals. Because
              years from now, when memories begin to fade, the feeling should
              remain. And that’s what we capture.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block overflow-x-hidden">
        <div className="grid lg:grid-cols-[55%_45%] min-h-screen custom-xxl:lg:grid-cols-[55%_45%] 2xl:grid-cols-[55%_45%]">
          {/* LEFT SIDE */}
          <div className="px-5 pt-[1rem]">
            {/* Logo */}
            <div className="mb-10 flex justify-center">
              <img src={LOGO} alt="" className="lg:w-[13rem]" />
            </div>

            {/* Content */}
            <div className="text-center max-w-3xl mx-auto xl:pt-28 2xl:-mt-12">
              <h1
                className="cinzel text-[#fff] lg:text-[3.9rem] custom-xxl:text-[6rem] 2xl:text-[4rem] pb-8"
                data-aos="fade-up"
              >
                ABOUT US
              </h1>

              <h2
                className="text-[#fff] text-xl cinzel pb-6 xl:mt-[3rem]  xl:text-2xl custom-xxl:text-3xl 2xl:text-xl 2xl:mt-[1rem] mx-auto"
                data-aos="fade-up"
              >
                Feeling Photography - Crafting memories since 2017
              </h2>

              <p
                className="cinzel text-[#dbdbdb] text-xl leading-relaxed pb-8  custom-xxl:text-2xl custom-xxl:mt-7 2xl:text-base 2xl:w-[35vw] mx-auto 2xl:mt-0 custom-xxl:w-[85%]"
                data-aos="fade-up"
              >
                What started as a passion for freezing fleeting moments slowly
                turned into something deeper. A desire to preserve stories. The
                quiet glances. The loud laughter.
              </p>

              <p
                className="cinzel text-[#dbdbdb] text-xl leading-relaxed pb-8  custom-xxl:text-2xl custom-xxl:mt-7 2xl:text-base 2xl:mt-0  2xl:w-[35vw] mx-auto custom-xxl:w-[90%]"
                data-aos="fade-up"
              >
                The name Feeling Photography represents exactly that — not just
                images, but feelings you can return to.
              </p>

              <p
                className="cinzel text-[#dbdbdb] text-xl leading-relaxed pb-8  custom-xxl:text-2xl custom-xxl:mt-7 2xl:mt-0 2xl:text-base 2xl:w-[35vw] mx-auto custom-xxl:w-[90%]"
                data-aos="fade-up"
              >
                From intimate weddings to vibrant celebrations, every frame is
                approached with intention and care.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="h-[110vh] overflow-x-hidden ">
            <img
              src={AboutImg}
              alt=""
              className="w-full h-full object-cover object-[35%_center] 2xl:object-[30%_center]"
              data-aos="fade-left"
            />
          </div>
        </div>
      </div>

      <div className="border-t-[.1px] border-white border-opacity-5 mt-6 2xl:mt-0">
        <Footer />
      </div>
    </div>
  );
}

export default About;
