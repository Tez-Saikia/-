import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "@/lib/axios.js";
import AOS from "aos";
import "aos/dist/aos.css";
import Nav from "../Nav/Nav";
import { BgVd } from "./galleryBgVdo/gllryVdBg";
import LOGO from "@/assets/LOGO.png";
import Footer from "../Footer/Footer";

const UserGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [shootFilter, setShootFilter] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/admin/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (activeCategory !== "All") {
          const selected = categories.find((c) => c.name === activeCategory);
          if (selected) {
            params.append("category", selected._id);
          }
        }

        if (locationFilter) {
          params.append("locationType", locationFilter);
        }

        if (shootFilter) {
          params.append("shootType", shootFilter);
        }

        if (search) {
          params.append("search", search);
        }

        const res = await axiosInstance.get(
          `/admin/gallery/all?${params.toString()}`,
        );

        setGalleryItems(res.data.data);
      } catch (error) {
        console.error("Gallery fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [activeCategory, locationFilter, shootFilter, search, categories]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (selectedImage) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [selectedImage]);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const el = containerRef.current;

    const checkScroll = () => {
      if (!el) return;
      setIsScrollable(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [categories, galleryItems]);

  return (
    <div className="relative bg-[#181716] pt-[8rem] overflow-hidden">
      {/* NAV */}
      <div className="absolute top-0 left-0 w-full z-50 ">
        <Nav />
      </div>

      {/* LOGO */}
      <div className="flex custom-xsm:justify-center relative custom-xsm:-top-[6.3rem] lg:hidden">
        <img src={LOGO} alt="" className="custom-xsm:w-[8rem]" />
      </div>

      {/* HERO VIDEO */}
      <div className="flex justify-center relative custom-xsm:h-[18rem] custom-ssm:h-[18rem] sm:h-[19.6rem] md:h-[21rem] h-full overflow-hidden custom-xsm:-mt-[2.5rem] lg:-mt-[11rem]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="custom-xsm:w-[14rem] custom-ssm:w-[17rem] sm:w-[20rem] md:w-[22rem] object-cover rounded-lg lg:hidden"
          src={BgVd.gllryBgVd}
        />
      </div>

      {/* Desktop */}
      <div
        className=" hidden lg:flex items-center justify-between gap-10 -mt-[18rem] lg:h-screen lg:max-h-screen 
        lg:overflow-hidden relative "
      >
        {/* Base Rose Texture */}
        <img
          src={BgVd.Rose_bg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.01]"
        />

        {/* Masked Rose */}
        <img
          src={BgVd.Rose_bg}
          alt=""
          className="absolute left-0 bottom-0 w-[65%] 2xl:w-[70%] h-full object-cover opacity-[0.25] 2xl:opacity-[0.35]
[mask-image:radial-gradient(circle_at_bottom_left,black_0%,black_45%,transparent_75%)]
[-webkit-mask-image:radial-gradient(circle_at_bottom_left,black_0%,black_45%,transparent_75%)]"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
      linear-gradient(
        to bottom right,
        #11120D 0%,
        rgba(17,18,13,0.95) 30%,
        rgba(17,18,13,0.85) 45%,
        rgba(17,18,13,0.75) 60%,
        rgba(17,18,13,0.6) 72%,
        rgba(17,18,13,0.45) 85%,
        rgba(17,18,13,0.25) 95%,
        rgba(17,18,13,0.1) 100%
      )
    `,
          }}
        />
        {/* CONTENT */}
        <div className="mb-16 relative z-20" data-aos="fade-up">
          {/* LOGO */}
          <div className="flex justify-center absolute top-6 left-0 right-0 2xl:top-[2.7rem] custom-xxl:top-[.3rem]">
            <img src={LOGO} alt="" className="w-[13rem] custom-xxl:w-[15rem]" />
          </div>

          {/* TEXT */}
          <div className="text-center px-4 mt-[15rem] custom-xxl:mt-[18rem] 2xl:mt-[16rem]">
            <h1 className="text-[3.9rem] custom-xxl:text-[5rem]  tracking-wide cinzel text-white">
              The Gallery
            </h1>

            <p className="text-[#dbdbdb] mt-10 text-lg cinzel custom-xxl:text-2xl 2xl:mt-[1rem] 2xl:text-lg tracking-wider">
              These are some of our most recent works.
            </p>

            <p className="text-[#dbdbdb] mt-4 text-lg cinzel xl:w-[80%] mx-auto custom-xxl:text-2xl custom-xxl:w-[80%] 2xl:mt-[1rem] 2xl:text-lg  2xl:w-[70%] tracking-wider">
              We specialize in a wide range of photo shooting and editing
              techniques, including documentary reportage, portraiture, fashion
              photography, and filmmaking.
            </p>

            <p className="text-[#dbdbdb] mt-4 text-lg cinzel xl:w-[80%] custom-xxl:w-[95%] mx-auto custom-xxl:text-2xl 2xl:mt-[1rem] 2xl:text-lg 2xl:w-[90%] tracking-wider">
              Each project reflects our passion for storytelling through
              visuals—capturing emotions, atmospheres, and unique perspectives.
              Explore our categories such as weddings, concerts, and more to
              view curated collections tailored to each occasion.
            </p>
          </div>
        </div>

        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-[28rem] xl:w-[32rem] custom-xxl:w-[39rem] flex-shrink-0 h-[100%] xl:h-[100%] 2xl:h-[100%] 2xl:w-[39rem] object-cover relative z-20"
          src={BgVd.gllryBgVd}
        />
      </div>

      <section className="px-6 md:px-16 py-20 min-h-screen custom-xsm:-mt-[2rem] lg:mt-0 lg:bg-[#fff]">
        {/* HEADER */}
        <div className="text-center mb-16  lg:hidden" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl tracking-wide cinzel text-white">
            Gallery
          </h1>
          <p className="text-white mt-2 sm:mt-5 text-xs sm:text-base cinzel">
            Timeless moments. Captured beautifully.
          </p>
        </div>

        {/* CATEGORY FILTER */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 lg:gap-10 py-6 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-2 custom-xsm:text-lg cinzel text-white lg:-mt-14 cursor-grab active:cursor-grabbing select-none ${
            isScrollable ? "justify-start" : "justify-center"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
          data-aos="fade-up"
        >
          <button
            onClick={() => setActiveCategory("All")}
            className={`flex-shrink-0 pb-1 border-b-2 transition text-white text-sm lg:text-xl custom-xxl: lg:text-black ${
              activeCategory === "All"
                ? "border-white lg:border-black custom-xxl:text-2xl"
                : "border-transparent hover:border-gray-400"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                if (isDragging.current) return;
                setActiveCategory(category.name);
              }}
              className={`flex-shrink-0 pb-1 border-b-2 transition text-sm lg:text-xl lg:text-black ${
                activeCategory === category.name
                  ? "border-white lg:border-black custom-xxl:text-2xl"
                  : "border-transparent hover:border-gray-400"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 justify-center pb-12 lg:gap-14">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm w-52 outline-none lg:border-[#a5a5a5] lg:text-xl custom-xxl:text-2xl custom-xxl:w-[20rem]"
          />

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm outline-none lg:border-[#a5a5a5] lg:text-xl custom-xxl:text-2xl"
          >
            <option value="">All Locations</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>

          <select
            value={shootFilter}
            onChange={(e) => setShootFilter(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm outline-none lg:border-[#a5a5a5] lg:text-xl custom-xxl:text-2xl"
          >
            <option value="">All Styles</option>
            <option value="candid">Candid</option>
            <option value="posed">Posed</option>
            <option value="editorial">Editorial</option>
            <option value="concert">Concert</option>
            <option value="fashion">Fashion</option>
            <option value="wedding">Wedding</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading gallery...
          </div>
        )}

        {/* GALLERY GRID */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryItems.length === 0 && (
              <div className="col-span-full text-center text-gray-400 lg:text-black py-20">
                No images found.
              </div>
            )}

            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
                data-aos="zoom-in"
                onClick={() => setSelectedImage(item)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.title || "Gallery Image"}
                    loading="lazy"
                    className="w-full aspect-[4/5] lg:aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full aspect-[4/5] lg:aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Hover Overlay */}
                {item.description && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-center">
                    <div>
                      <p className="text-white text-sm lg:text-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                        {item.description}
                      </p>

                      <div className="text-white text-4xl lg:text-5xl mt-2 opacity-0 group-hover:opacity-100 transition">
                        ⛶
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FULLSCREEN MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-6 text-white text-3xl"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>

          {/* Conditional Media */}
          {selectedImage.type === "image" ? (
            <img
              src={selectedImage.url}
              alt={selectedImage.altText || "Fullscreen"}
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={selectedImage.url}
              controls
              autoPlay
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      <div className="border-t-[.1px] border-white border-opacity-5 mt-6">
        <Footer />
      </div>
    </div>
  );
};

export default UserGallery;
