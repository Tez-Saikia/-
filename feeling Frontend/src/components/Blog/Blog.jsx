import React, { useEffect } from "react";
import Nav from "../Nav/Nav";
import "../../Fonts.css";
import "./BlogImgs/BlogImg";
import BlogImg from "./BlogImgs/BlogImg";
import Footer from "../Footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";
import LOGO from "@/assets/LOGO.png";

function Blog() {
  useEffect(() => {
    Aos.init({ once: true, duration: 2000 });
  });

  const blogPosts = [
    {
      img: BlogImg.blog1,
      title: "Fashion as an Art Form",
      text: `Fashion, much like photography, is a form of artistic expression. Traditional Indian fashion, with its rich history and cultural significance, offers a unique canvas for creativity. The blend of colors, patterns, and textures in traditional attire tells a story of heritage and craftsmanship that transcends time.`,
      layout: "left",
      imageWidth: "w-[80%]",
      textAlign: "text-left",
      animation: "fade-up",
    },
    {
      img: BlogImg.blog2,
      title: "Symbolism of the Wedding Ring",
      text: `The wedding ring, a timeless symbol of love and commitment, holds a special place in matrimonial ceremonies. This photograph showcases the elegance of a beautifully adorned wedding ring on the bride's hand. The intricate design of the ring, coupled with its sparkling brilliance, captures the essence of eternal love and the promise of a shared future. This image eloquently portrays the significance of this cherished piece of jewelry in celebrating the bond between two hearts.`,
      layout: "right",
      imageWidth: "w-[70%]",
      textAlign: "text-right",
      animation: "fade-up",
    },
    {
      img: BlogImg.blog3,
      title: "A Beautiful Wedding Ceremony",
      text: `This image captures a significant moment in a traditional wedding ceremony. The bride is placing a garland around the groom's neck. The beautifully decorated backdrop with a floral arch of red and white roses, and the words "Better Together" illuminated above the couple, add to the charm. The scene is further enhanced by sparkling lights and a festive atmosphere, making this a memorable and joyous occasion.`,
      layout: "left",
      imageWidth: "w-[70%]",
      textAlign: "text-left",
      animation: "fade-up",
    },
    {
      img: BlogImg.blog4,
      title: "A Timeless Connection",
      text: `This image beautifully captures a moment of intimacy and connection between two individuals. The serene outdoor setting with lush greenery in the background adds to the timeless and cultural significance of the moment. The gesture of placing a hand on the chest signifies affection and unity, making this photograph a poignant representation of love and togetherness in a traditional ceremonial context.`,
      layout: "right",
      imageWidth: "w-[70%]",
      textAlign: "text-right",
      animation: "fade-up",
    },
    {
      img: BlogImg.blog5,
      title: "A Colorful Celebration",
      text: `This image captures a vibrant and festive moment at a cultural event. Three individuals are seated together on a decorated stage. The backdrop of draped white and pink fabric, adorned with garlands of marigold flowers, adds to the celebratory ambiance. This photograph beautifully showcases the essence of cultural festivities and the joy of togetherness.`,
      layout: "left",
      imageWidth: "w-[70%]",
      textAlign: "text-left",
      animation: "fade-up",
    },
  ];

  return (
    <>
      {/* HERO */}
      <div className="relative h-screen 2xl:h-[110vh]">
        {/* NAV */}
        <div className="absolute top-0 left-0 w-full z-50">
          <Nav />
        </div>

        {/* IMAGE */}
        <img
          src={BlogImg.mainBg}
          alt=""
          className="w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#11120D]/70 z-10"></div>

        {/* LOGO */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40">
          <img
            src={LOGO}
            alt=""
            className="custom-xsm:w-[8rem] lg:w-[13rem] 2xl:top-[2.7rem]"
          />
        </div>

        {/* TEXT */}
        <div className="absolute custom-xsm:top-[13rem] lg:top-[19rem] xl:top-[20rem] custom-xxl:top-[24rem] left-1/2 -translate-x-1/2 text-center z-40 px-2 2xl:-mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.9rem] custom-xxl:text-[6rem] 2xl:text-[4rem] tracking-wide cinzel text-white text-nowrap">
            THE BLOG
          </h1>

          <p className="text-xs sm:text-base lg:text-xl cinzel text-[#dbdbdb] mt-7 w-[90vw] md:w-[80vw] lg:w-[60vw] xl:mt-[4rem] xl:w-[55vw] xl:text-2xl custom-xxl:w-[54vw] custom-xxl:text-3xl tracking-wider 2xl:mt-10 2xl:w-[40vw] 2xl:text-lg">
            Explore the blog for a captivating blend of real weddings, heartfelt
            couple portraits, and beautifully curated editorial sessions.
          </p>

          <p className="text-xs sm:text-base lg:text-xl cinzel text-[#dbdbdb] mt-5 w-[90vw] md:w-[80vw] lg:w-[60vw]  xl:w-[55vw] xl:text-2xl custom-xxl:w-[55vw] custom-xxl:text-3xl tracking-wider 2xl:mt-[2rem] 2xl:w-[40vw] 2xl:text-lg">
            Step behind the scenes and immerse yourself in stories filled with
            emotion, culture, and timeless elegance.
          </p>

          <p className="text-xs sm:text-base lg:text-xl cinzel text-[#dbdbdb] mt-5 w-[90vw] md:w-[80vw] lg:w-[60vw]  xl:w-[55vw] xl:text-2xl custom-xxl:w-[55vw] custom-xxl:text-3xl tracking-wider 2xl:mt-[2rem] 2xl:w-[40vw] 2xl:text-lg">
            Each story captures genuine emotions, timeless details, and the
            beauty of love in its most authentic form. Find inspiration,
            creative ideas, and unforgettable moments — all beautifully told
            through our lens.
          </p>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="pt-20 lg:hidden">
        <div className="max-w-2xl mx-auto px-2 pb-14">
          <img
            data-aos="fade-up"
            data-aos-duration="3000"
            src={BlogImg.blog1}
            alt=""
            className="w-full sm:w-[50%] mx-auto rounded-lg shadow-lg mb-6 "
          />
          <h1
            className="text-center text-xl sm:text-2xl cinzel text-[#4B4B4B] pb-4 md:text-xl"
            data-aos="fade-up"
          >
            Fashion as an Art Form
          </h1>

          <p
            className="text-center cinzel text-xs sm:text-sm lg:text-2xl text-[#414141]  leading-relaxed tracking-wider"
            data-aos="fade-up"
          >
            Fashion, much like photography, is a form of artistic expression.
            Traditional Indian fashion, with its rich history and cultural
            significance, offers a unique canvas for creativity. The blend of
            colors, patterns, and textures in traditional attire tells a story
            of heritage and craftsmanship that transcends time.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-2 pb-14">
          <img
            data-aos="fade-up"
            data-aos-duration="3000"
            src={BlogImg.blog2}
            alt=""
            className="w-full sm:w-[50%] mx-auto rounded-lg shadow-lg mb-6 "
          />
          <h1
            className="text-center text-xl sm:text-2xl cinzel text-[#4B4B4B] pb-4 md:text-xl"
            data-aos="fade-up"
          >
            Symbolism of the Wedding Ring
          </h1>

          <p
            className="text-center cinzel text-xs sm:text-sm lg:text-2xl text-[#414141]  leading-relaxed tracking-wider"
            data-aos="fade-up"
          >
            The wedding ring, a timeless symbol of love and commitment, holds a
            special place in matrimonial ceremonies. This photograph showcases
            the elegance of a beautifully adorned wedding ring on the bride's
            hand. The intricate design of the ring, coupled with its sparkling
            brilliance, captures the essence of eternal love and the promise of
            a shared future. This image eloquently portrays the significance of
            this cherished piece of jewelry in celebrating the bond between two
            hearts.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-2 pb-14">
          <img
            data-aos="fade-up"
            data-aos-duration="3000"
            src={BlogImg.blog3}
            alt=""
            className="w-full sm:w-[50%] mx-auto rounded-lg shadow-lg mb-6 "
          />
          <h1
            className="text-center text-xl sm:text-2xl cinzel text-[#4B4B4B] pb-4 md:text-xl"
            data-aos="fade-up"
          >
            A Beautiful Wedding Ceremony
          </h1>

          <p
            className="text-center cinzel text-xs sm:text-sm lg:text-2xl text-[#414141]  leading-relaxed tracking-wider"
            data-aos="fade-up"
          >
            This image captures a significant moment in a traditional wedding
            ceremony. The bride is placing a garland around the groom's neck.
            The beautifully decorated backdrop with a floral arch of red and
            white roses, and the words "Better Together" illuminated above the
            couple, add to the charm. The scene is further enhanced by sparkling
            lights and a festive atmosphere, making this a memorable and joyous
            occasion.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-2 pb-14">
          <img
            data-aos="fade-up"
            data-aos-duration="3000"
            src={BlogImg.blog4}
            alt=""
            className="w-full sm:w-[50%] mx-auto rounded-lg shadow-lg mb-6 "
          />
          <h1
            className="text-center text-xl sm:text-2xl cinzel text-[#4B4B4B] pb-4 md:text-xl"
            data-aos="fade-up"
          >
            A Timeless Connection
          </h1>

          <p
            className="text-center cinzel text-xs sm:text-sm lg:text-2xl text-[#414141]  leading-relaxed tracking-wider"
            data-aos="fade-up"
          >
            This image captures a significant moment in a traditional wedding
            ceremony. The bride is placing a garland around the groom's neck.
            The beautifully decorated backdrop with a floral arch of red and
            white roses, and the words "Better Together" illuminated above the
            couple, add to the charm. The scene is further enhanced by sparkling
            lights and a festive atmosphere, making this a memorable and joyous
            occasion.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-2 pb-14">
          <img
            data-aos="fade-up"
            data-aos-duration="3000"
            src={BlogImg.blog5}
            alt=""
            className="w-full sm:w-[50%] mx-auto rounded-lg shadow-lg mb-6 "
          />
          <h1
            className="text-center text-xl sm:text-2xl cinzel text-[#4B4B4B] pb-4 md:text-xl"
            data-aos="fade-up"
          >
            A Colorful Celebration
          </h1>

          <p
            className="text-center cinzel text-xs sm:text-sm lg:text-2xl text-[#414141]  leading-relaxed tracking-wider"
            data-aos="fade-up"
          >
            This image captures a vibrant and festive moment at a cultural
            event. Three individuals are seated together on a decorated stage.
            The backdrop of draped white and pink fabric, adorned with garlands
            of marigold flowers, adds to the celebratory ambiance. This
            photograph beautifully showcases the essence of cultural festivities
            and the joy of togetherness.
          </p>
        </div>
      </div>

      {/* Desktop BLOG CONTENT */}
      <div className="pt-20 hidden lg:block">
        {blogPosts.map((post, index) => {
          const isImageRight = post.layout === "right";

          return (
            <div
              key={index}
              className="max-w-6xl mx-auto px-6 pb-36 grid lg:grid-cols-2 gap-4 items-center"
            >
              {/* Image */}
              <div
                className={`flex ${isImageRight ? "lg:order-2 justify-end" : "lg:order-1 justify-start"}`}
                data-aos={post.animation}
              >
                <div className="w-full max-w-[25rem] h-[22rem] xl:h-[24rem] 2xl:h-[26rem] rounded-sm overflow-hidden shadow-2xl shadow-black/40">
                  <img
                    src={post.img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className={`${isImageRight ? "lg:order-1" : "lg:order-2"} ${post.textAlign}`}
                data-aos={post.animation}
              >
                <h1 className="cinzel text-2xl text-[#4B4B4B] pb-6">
                  {post.title}
                </h1>

                <p className="cinzel text-lg text-[#414141] leading-relaxed tracking-wide">
                  {post.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
}

export default Blog;
