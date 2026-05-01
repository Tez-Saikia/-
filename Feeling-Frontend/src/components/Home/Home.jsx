import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { homeImgs } from "./homeImgs/homeImgs";
import "../../Fonts.css";
import Footer from "../Footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSticky, setIsSticky] = useState(true);

  const authAdmin = useAdminAuthStore((state) => state.authAdmin);

  useEffect(() => {
    Aos.init({ once: true, duration: 2000 });
  }, []);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const services = [
    {
      title: "Photography",
      image: homeImgs.Sec4_1,
      desc1: `At Feeling Photography, we capture life’s most special moments through a perfect blend of candid and traditional photography. From weddings and celebrations to personal milestones, we focus on preserving genuine emotions and timeless details.`,
      desc2: `We also offer professional portrait sessions and customized shoots tailored to your unique style, ensuring every memory is beautifully captured and cherished forever.`,
    },
    {
      title: "Videography",
      image: homeImgs.Sec4_3,
      desc1: `At Feeling Photography, we create cinematic videos that tell your story with emotion, creativity, and precision. From weddings and celebrations to personal events, we focus on capturing every meaningful moment with a storytelling approach.`,
      desc2: `Our team uses professional filming and editing techniques to craft visually stunning films, ensuring each frame reflects your story beautifully and transforms your memories into timeless cinematic experiences.`,
    },
    {
      title: "Photobooks & Albums",
      image: homeImgs.Sec4_2,
      desc1: `At Feeling Photography, we preserve your most cherished memories through premium-quality photobooks and albums designed with elegance and detail. From weddings to personal milestones, each album is thoughtfully curated to tell your story.`,
      desc2: `We offer fully customized designs with high-quality materials and finishes, ensuring your memories are presented beautifully and remain timeless keepsakes that you can revisit and treasure forever.`,
    },
    {
      title: "Post-production",
      image: homeImgs.Sec4_4,
      desc1: `At Feeling Photography, our post-production process enhances your visuals by transforming raw footage into refined and cinematic creations. From weddings to creative projects, we focus on bringing out the best in every frame.`,
      desc2: `Through expert editing, color grading, and sound design, we ensure a seamless and polished final result, delivering visually compelling content that captures emotion and truly reflects the essence of your story.`,
    },
  ];

  return (
    <>
      {/* Section 1 */}
      <div className="relative h-[100vh]   xl:min-h-screen xl:h-auto w-full overflow-hidden">
        {/* Background Image */}
        <img
          src={homeImgs.Img1}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt=""
        />

        {/* Blur Effect */}
        <div className="absolute inset-0 bg-[#5D7377]/50 backdrop-blur-sm z-10"></div>

        {/* Nav */}
        <Nav />

        <div className="relative z-20 h-full custom-xsm:-mt-[.9rem]">
          {/* Logo */}
          <div className="flex justify-center items-center lg:pl-4 mt-10 lg:hidden">
            <img
              src={homeImgs.LOGO}
              className="custom-xsm:w-[8rem] lg:w-[9.5rem] xl:w-[10rem] custom-xxl:w-[12rem]"
              alt="Logo"
            />
          </div>

          {/* Main Image */}
          <div className="flex justify-center  items-center lg:mt-10 lg:justify-between lg:px-4 h-full custom-xsm:-mt-[6rem]">
            <img
              className="hidden lg:block rounded-lg  lg:w-[20rem] lg:mt-[15rem] xl:w-[23rem] xl:mt-[28.7rem] custom-xxl:w-[28rem] custom-xxl:mt-[31rem]"
              src={homeImgs.Main1}
              alt="Main"
            />

            <img
              className="rounded-lg custom-xsm:w-[14rem] custom-ssm:w-[17rem] lg:w-[20rem] xl:w-[23rem] custom-xxl:w-[28rem] custom-xxl:mt-[10rem]"
              src={homeImgs.Main2}
              alt="Main"
            />

            <img
              className="rounded-lg hidden lg:block lg:w-[20rem] lg:mt-[15rem] xl:w-[23rem] xl:mt-[28.7rem] custom-xxl:w-[28rem] custom-xxl:mt-[31rem]"
              src={homeImgs.Main3}
              alt="Main"
            />
          </div>

          {/* Paragraph */}
          <div className="absolute custom-smm:bottom-[7rem]  custom-xsm:bottom-[6rem] sm:bottom-[5rem] w-full flex justify-center lg:hidden">
            <p className="cinzel text-white text-center text-lg sm:text-xl">
              Welcome to Feeling Photography
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-[#F2EDE7] py-6 px-4 lg:px-40 xl:px-[23rem] xl:py-20">
        <p className="hidden lg:block cinzel text-[#414141] text-center text-[.7rem] sm:text-[.8rem] lg:text-[1.5rem] xl:text-[1.7rem] tracking-wide">
          Welcome to Feeling Photography
        </p>

        <p className="cinzel text-[#414141] text-center text-[.7rem] mt-6 sm:text-[.8rem] lg:text-[.9rem] xl:text-[1rem]">
          where we infuse magic into your wedding memories turning them into
          timeless tales of love and companionship.
        </p>

        <p className="cinzel text-[#414141] text-center text-[.7rem] mt-6 sm:text-[.8rem] lg:text-[.9rem] xl:text-[1rem]">
          Experience our premium photo and video services, crafted to capture
          every precious moment. Transforming traditional wedding photography by
          blending documentary, editorial and analog photography.
        </p>
      </div>

      {/* Section 3 */}
      <div className="p-3 xl:px-12 xl:py-14 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 custom-xsm:mt-8 xl:gap-32">
          {/* Paragraph */}
          <div className="hidden lg:block lg:w-[40%] xl:w-1/2 min-w-0">
            <p className="cinzel text-[#414141] text-center lg:text-left text-[.7rem] sm:text-[.8rem] xl:text-[1rem]">
              Established in 2017, Feeling Photography blossomed as a premier
              boutique studio, dedicated to capturing the enchanting tales of
              life's most memorable moments.
            </p>

            <p className="cinzel text-[#414141] text-center lg:text-left text-[.7rem] sm:text-[.8rem] mt-6 xl:text-[1rem]">
              We believe in and exist to showcase the most beautiful and
              heartfelt stories of your life in their true magnificence.
            </p>

            <p className="cinzel text-[#414141] text-center lg:text-left text-[.7rem] sm:text-[.8rem] mt-6 xl:text-[1rem]">
              Our team of ardent and imaginative professionals excels in
              crafting, capturing, and immortalizing a wide array of events,
              from weddings to corporate functions, and everything in between.
              Over the past decade, we've evolved through extensive experience,
              covering diverse celebrations across Assam.
            </p>
          </div>

          {/* Images */}
          <div className="flex justify-center xl:justify-end gap-2 sm:gap-6 lg:w-[60%] lg:gap-3 xl:w-1/2 min-w-0">
            <img
              className="custom-xsm:w-[4.6rem] custom-ssm:w-[6rem] sm:w-[11rem] lg:w-[11.5rem] xl:w-[12.5rem]"
              src={homeImgs.secondSecImg1}
              alt=""
            />
            <img
              className="custom-xsm:w-[4.6rem] custom-ssm:w-[6rem] sm:w-[11rem] lg:w-[11.5rem] xl:w-[12.5rem]"
              src={homeImgs.secondSecImg2}
              alt=""
            />
            <img
              className="custom-xsm:w-[4.6rem] custom-ssm:w-[6rem] sm:w-[11rem] lg:w-[11.5rem] xl:w-[12.5rem]"
              src={homeImgs.secondSecImg3}
              alt=""
            />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="custom-xsm:mt-8 lg:hidden">
          <p className="cinzel text-[#414141] text-center text-[.7rem] sm:text-[.8rem]">
            Established in 2017, Feeling Photography blossomed as a premier
            boutique studio, dedicated to capturing the enchanting tales of
            life's most memorable moments.
          </p>

          <p className="cinzel text-[#414141] text-center text-[.7rem] mt-6 sm:text-[.8rem]">
            We believe in and exist to showcase the most beautiful and heartfelt
            stories of your life in their true magnificence.
          </p>

          <p className="cinzel text-[#414141] text-center text-[.7rem] mt-6 sm:text-[.8rem]">
            Our team of ardent and imaginative professionals excels in crafting,
            capturing, and immortalizing a wide array of events, from weddings
            to corporate functions, and everything in between. Over the past
            decade, we've evolved through extensive experience, covering diverse
            celebrations across Assam.
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div className="relative w-full custom-xsm:mt-8  custom-xsm:h-[100vh]  sm:h-[110vh] 2xl:h-[160vh] lg:h-screen h-auto bg-[#A39382] overflow-hidden">
        {/* Base Image */}
        <img
          src={homeImgs.Section3_mainImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.01]"
        />

        {/*  highlight */}
        <img
          src={homeImgs.Section3_mainImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.11]
      [mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_20%,transparent_70%)]
      [-webkit-mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_20%,transparent_70%)]"
        />

        {/* Gradient */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom_right, #A39382_0%, #A39382_50%,rgba(163,147,130,0.95)_65%, rgba(163,147,130,0.7)_80%, rgba(163,147,130,0.3)_100%)]" />

        {/* Content Wrapper */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[28rem] sm:min-h-[32rem] lg:min-h-[38rem] xl:min-h-[45rem] custom-xxl:min-h-[55rem] gap-6 ">
          {/* Title */}
          <div className="flex items-center justify-center custom-xsm:mt-5 gap-3">
            <div className="border-t-[0.5px] border-white/30 w-[19rem] lg:w-[24rem] xl:w-[39rem]" />
            <p className="cinzel text-white text-[1rem] tracking-[0.1em] lg:text-[1.7rem] xl:text-[2rem] custom-xxl:text-[2.5rem] whitespace-nowrap">
              Our Services
            </p>
            <div className="border-t-[0.5px] border-white/30 w-[19rem] lg:w-[24rem] xl:w-[39rem]" />
          </div>

          <div
            key={currentIndex}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-16 lg:p-14 h-[28rem] sm:h-[32rem] lg:h-[38rem] xl:h-[45rem] custom-xxl:h-[55rem]"
          >
            <div className="flex items-center justify-center w-full lg:w-[50%] flex-shrink-0">
              <div className="w-full px-2 custom-ssm:w-[20rem] sm:w-[17rem] lg:w-[33rem] xl:w-[40rem]  aspect-[4/5] overflow-hidden rounded-xl 2xl:mt-20">
                <img
                  src={services[currentIndex].image}
                  alt=""
                  className="w-full h-full object-cover animate-fadeIn drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start lg:pt-16 animate-fadeIn h-full justify-center max-w-lg custom-xxl:max-w-[45rem] custom-xsm:overflow-visible overflow-hidden text-center lg:text-left 2xl:mt-16">
              <h1 className="cinzel text-[#4B4B4B] text-[1.7rem] sm:text-[2rem] lg:text-[3rem] xl:text-[3.8rem] custom-xxl:text-[4.5rem] uppercase">
                {services[currentIndex].title}
              </h1>

              <div className="px-3 custom-xsm:mb-4 lg:mt-5">
                <p
                  className="cinzel text-[#4B4B4B] custom-xsm:text-[.74rem] sm:text-[.8rem] lg:text-[1rem] text-center lg:text-left xl:text-[1.2rem] custom-xxl:text-[1.5rem] max-w-lg custom-xxl:max-w-[45rem] leading-relaxed 
                  lg:line-clamp-none"
                >
                  {services[currentIndex].desc1}
                </p>

                <p
                  className="cinzel text-[#4B4B4B] custom-xsm:text-[.74rem] custom-xsm:mt-2 sm:text-[.8rem] lg:mt-3 lg:text-[1rem] text-center lg:text-left xl:text-[1.2rem] custom-xxl:text-[1.5rem] max-w-lg custom-xxl:max-w-[45rem] leading-relaxed 
                   lg:line-clamp-none"
                >
                  {services[currentIndex].desc2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="bg-[#F2EDE7] pt-8 pb-7 xl:py-20">
        <p className="cinzel text-[#4B4B4B] custom-xsm:text-[.5rem] sm:text-[.7rem] lg:text-[.8rem] xl:text-[1rem] 2xl:text-[1.4rem] text-center  leading-relaxed">
          YOUR SPECIAL DAY, BEAUTIFULLY TOLD THROUGH OUR LENS
        </p>

        <p className="cinzel text-[#4B4B4B] custom-xsm:text-[.9rem] sm:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.5rem] custom-xsm:mt-3 text-center 2xl:text-[2rem]  leading-relaxed">
          READY TO CREATE TIMELESS MEMORIES TOGETHER?
        </p>

        {/* Centered button */}
        <div className="flex justify-center mt-9">
          <button
            onClick={() => navigate("/chat")}
            className="cinzel border border-[#4B4B4B] px-5 py-2 sm:px-7 sm:py-3 text-[#4B4B4B] custom-xsm:text-[.7rem] sm:text-[.9rem] lg:text-[1rem] 2xl:text-[1.5rem]"
          >
            GET IN TOUCH
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
