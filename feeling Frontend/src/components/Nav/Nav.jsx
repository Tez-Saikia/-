import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { navImages } from "./navImages/navImages";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { homeImgs } from "../Home/homeImgs/homeImgs";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuBtnRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const logoRef = useRef(null);

  const currentUser = useAuthStore((state) => state.authUser);
  const logoutUser = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isCheckingAuth);

  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updateAvatar = useAuthStore((state) => state.updateAvatar);
  const changePassword = useAuthStore((state) => state.changePassword);

  const authAdmin = useAdminAuthStore((state) => state.authAdmin);
  const adminData = useAdminAuthStore((state) => state.adminData);
  const logoutAdmin = useAdminAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  const [isSticky, setIsSticky] = useState(true);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showHamburger, setShowHamburger] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: null,
    password: "",
  });

  const navRef = useRef(null);
  const profileMenuRefDesktop = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.username || formData.email) {
        await updateProfile({
          username: formData.username,
          email: formData.email,
        });
      }

      if (formData.avatar) {
        await updateAvatar(formData.avatar);
      }

      if (formData.password) {
        await changePassword({
          oldPassword: prompt("Enter your old password:"),
          newPassword: formData.password,
        });
      }

      setShowEditForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!navRef.current) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        navRef.current.classList.add("-translate-y-full");
        setShowHamburger(false);
      } else {
        navRef.current.classList.remove("-translate-y-full");
        setShowHamburger(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRefDesktop.current &&
        !profileMenuRefDesktop.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        avatar: null,
        password: "",
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      navigate("/", { replace: true });

      if (authAdmin) await logoutAdmin();
      else await logoutUser();

      setIsMenuOpen(false);
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }

    const success = await deleteAccount();

    if (success) {
      setShowDeleteModal(false);
      navigate("/", { replace: true });
    }
  };

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blogs", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  const mobileMenuItems = [
    ...navItems,
    { name: "Chat", action: "chat" },
    { name: "Auth", action: "auth" },
  ];

  const socialItems = [
    {
      type: "button",
      icon: <IoChatbubbleEllipsesSharp />,
      action: handleChatClick,
    },
    {
      type: "link",
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/rahul.das.357?mibextid=UuH66acrLgeVUPia",
    },
    {
      type: "link",
      icon: <AiFillInstagram />,
      href: "https://www.instagram.com/Rahul.das_photography",
    },
    {
      type: "link",
      icon: <IoLogoWhatsapp />,
      href: "https://wa.me/919101241276",
    },
    {
      type: "link",
      icon: <MdEmail />,
      href: "mailto:rahul19941997@gmail.com",
    },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <nav
      ref={navRef}
      className="fixed w-full top-0 z-50 transition-transform duration-300"
    >
      <div className="-ml-8"></div>

      {/* Desktop Menu Button */}
      {!isHomePage && (
        <div
          ref={menuBtnRef}
          className="fixed top-6 right-6 custom-xsm:top-2 custom-xsm:right-4 z-[99] transition-transform duration-300 hidden lg:block"
        >
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? (
              <IoMdClose className="text-white lg:text-[2.5rem] custom-xxl:text-[3rem]" />
            ) : (
              <img
                className="lg:w-[6rem] custom-xxl:w-[7rem] 2xl:w-[6rem]"
                src={navImages.lg_Nav}
                alt=""
              />
            )}
          </button>
        </div>
      )}

      {/* Desktop Menu 1 */}
      <ul
        className={`"fixed inset-0 z-[40] hidden lg:flex flex-col items-center  justify-start 2xl:justify-center 
  cinzel text-2xl gap-8 transition-all duration-500 ease-in-out  overflow-hidden bg-[#11120D] touch-none h-screen max-h-screen  " ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}  overflow-hidden  bg-[#11120D] touch-none`}
      >
        <div className="relative z-20 flex items-center justify-center px-6 py-5 border-b border-white/20 w-full  ">
          {currentUser ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={currentUser?.avatar || "/default-avatar.png"}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
                className="w-24 h-24   custom-xxl:w-36 custom-xxl:h-36 2xl:h-20 2xl:w-20 rounded-full  object-cover border border-white"
              />
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setIsMenuOpen(true);
                }}
                className="text-white text-sm font-alegreya xl:text-xl custom-xxl:text-xl 2xl:text-lg"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <span className="text-white text-xl custom-xxl:text-2xl pb-3  xl:mt-16 xl:pb-5">
              Guest
            </span>
          )}
        </div>

        <img
          src={navImages.bgRose}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.01]"
        />

        <img
          src={navImages.bgRose}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.14]
           [mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_30%,transparent_75%)]
           [-webkit-mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_30%,transparent_75%)]"
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
               linear-gradient(
                 to bottom right,
                 #11120D 0%,
                 rgba(17,18,13,0.85) 50%,
                 rgba(17,18,13,0.65) 65%,
                 rgba(17,18,13,0.45) 80%,
                 rgba(17,18,13,0.25) 100%
               )
             `,
          }}
        />

        {/* li */}
        <div className=" relative z-20 flex flex-col items-center  gap-16 pt-7 xl:gap-20 custom-xxl:gap-24 custom-xxl:pt-16  2xl:gap-12 2xl:pt-10">
          {mobileMenuItems.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <span
                  className={`text-xl custom-xxl:text-2xl mr-2 transition-colors duration-300 2xl:text-sm ${
                    isActive ? "text-[#7D7D7D]" : "text-white"
                  }`}
                >
                  {number} /
                </span>

                {/* Normal links */}
                {item.path && (
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors text-3xl custom-xxl:text-4xl 2xl:text-xl ${
                      isActive ? "text-[#7D7D7D]" : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Chat */}
                {item.action === "chat" && (
                  <button
                    onClick={handleChatClick}
                    className="transition-colors text-3xl duration-300 text-white custom-xxl:text-4xl 2xl:text-xl"
                  >
                    Chat
                  </button>
                )}

                {/* Login / Logout */}
                {item.action === "auth" &&
                  (currentUser ? (
                    <button
                      className="transition-colors text-3xl custom-xxl:text-4xl duration-300 text-white 2xl:text-xl"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  ) : (
                    <a
                      href="/login"
                      className={`transition-colors text-3xl custom-xxl:text-4xl duration-300 2xl:text-xl ${
                        location.pathname === "/login"
                          ? "text-[#7D7D7D]"
                          : "text-white"
                      }`}
                    >
                      Login
                    </a>
                  ))}
              </li>
            );
          })}
        </div>
      </ul>

      {isHomePage && (
        <div className="hidden lg:flex justify-between items-center w-full px-6 pt-2 cinzel fixed top-[4rem] left-0 z-50">
          {/* Left Nav links */}
          <ul className="flex gap-9 text-white text-base lg:text-[.7rem] custom-xxl:text-[1rem]">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative group"
                >
                  {item.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-[1px] bg-white transition-all duration-300 
              ${
                location.pathname === item.path
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
                  />
                </NavLink>
              </li>
            ))}

            <li>
              {currentUser ? (
                <button onClick={handleLogout} className="relative group">
                  Logout
                  <span className="absolute left-0 -bottom-1 h-[1px] bg-white w-0 group-hover:w-full transition-all duration-300"></span>
                </button>
              ) : (
                <NavLink to="/login" className="relative group">
                  Login
                  <span className="absolute left-0 -bottom-1 h-[1px] bg-white w-0 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              )}
            </li>
          </ul>

          <div
            ref={logoRef}
            className="fixed left-[47%] lg:left-1/2 lg:top-4 custom-xxl:-top-1 -translate-x-1/2 transition-transform duration-300 z-50"
          >
            <img
              src={homeImgs.LOGO}
              className="custom-xsm:w-[8rem] lg:w-[9.5rem] xl:w-[10rem] custom-xxl:w-[12rem]"
              alt="Logo"
            />
          </div>

          {/* Right Social Icons */}
          <ul className="flex gap-5 text-[#5D7377]">
            {socialItems.map((item, index) => (
              <li key={index}>
                {item.type === "link" ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-[6px] bg-white rounded-full hover:bg-gray-200 transition"
                  >
                    {item.icon}
                  </a>
                ) : (
                  <button
                    onClick={item.action}
                    className="inline-flex items-center justify-center p-[6px] bg-white rounded-full hover:bg-gray-200 transition"
                  >
                    {item.icon}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile hamburger */}
      <div
        ref={mobileMenuBtnRef}
        className={`fixed top-4 right-3 z-[100] transition-all duration-300 lg:hidden ${
          showHamburger ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? (
            <IoMdClose className="text-white text-[1.5rem]" />
          ) : (
            <RxHamburgerMenu className="text-white text-[1.5rem]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`fixed inset-0 z-[40] flex flex-col items-center justify-center cinzel text-2xl gap-8 transition-all duration-500 ease-in-out lg:hidden
        ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"} lg:hidden overflow-hidden bg-[#11120D] touch-none`}
      >
        <div className="relative z-20 flex items-center justify-center px-6 py-5 border-b border-white/20 w-full">
          {currentUser ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={currentUser?.avatar || "/default-avatar.png"}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
                className="w-20 h-20 rounded-full  object-cover border border-white"
              />
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setIsMenuOpen(true);
                }}
                className="text-white text-sm font-alegreya"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <span className="text-white text-lg">Guest</span>
          )}
        </div>

        <img
          src={navImages.bgRose}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.01]"
        />

        <img
          src={navImages.bgRose}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.14]
           [mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_30%,transparent_75%)]
           [-webkit-mask-image:radial-gradient(circle_at_bottom_right,black_0%,black_30%,transparent_75%)]"
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
               linear-gradient(
                 to bottom right,
                 #11120D 0%,
                 rgba(17,18,13,0.85) 50%,
                 rgba(17,18,13,0.65) 65%,
                 rgba(17,18,13,0.45) 80%,
                 rgba(17,18,13,0.25) 100%
               )
             `,
          }}
        />

        {/* li */}
        <div className="relative z-20 flex flex-col items-center gap-8">
          {mobileMenuItems.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <span
                  className={`text-xs mr-2 transition-colors duration-300 ${
                    isActive ? "text-[#7D7D7D]" : "text-white"
                  }`}
                >
                  {number} /
                </span>

                {/* Normal links */}
                {item.path && (
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors text-xl ${
                      isActive ? "text-[#7D7D7D]" : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Chat */}
                {item.action === "chat" && (
                  <button
                    onClick={handleChatClick}
                    className="transition-colors text-xl duration-300 text-white"
                  >
                    Chat
                  </button>
                )}

                {/* Login / Logout */}
                {item.action === "auth" &&
                  (currentUser ? (
                    <button
                      className="transition-colors text-xl duration-300 text-white"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  ) : (
                    <a
                      href="/login"
                      className={`transition-colors text-xl duration-300 ${
                        location.pathname === "/login"
                          ? "text-[#7D7D7D]"
                          : "text-white"
                      }`}
                    >
                      Login
                    </a>
                  ))}
              </li>
            );
          })}
        </div>
      </ul>

      {/* Edit Profile Form */}
      {showEditForm && (
        <div className="fixed  inset-0 flex items-center justify-center bg-black  z-[999]">
          <div className="bg-[#1f1f1f] p-6 rounded-lg w-[18rem] lg:w-[30rem] lg:h-[auto] relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white lg:text-[1.5rem]"
            >
              ✕
            </button>
            <h2 className="text-xl lg:text-2xl text-white font-alegreya font-semibold mb-4">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="p-2 lg:p-4 lg:text-xl rounded bg-gray-800 text-white outline-none border-white"
              />
              <input
                type="email"
                placeholder="Email"
                disabled={currentUser?.isGoogleUser}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`p-2 lg:p-4 lg:text-xl rounded bg-gray-800 text-white outline-none ${
                  currentUser?.isGoogleUser
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files[0] })
                }
                className="p-2 lg:p-4 lg:text-xl rounded bg-gray-800 text-white outline-none"
              />
              {!currentUser?.isGoogleUser && (
                <input
                  type="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="p-2 lg:p-4 lg:text-xl rounded bg-gray-800 text-white"
                />
              )}
              <button
                type="submit"
                className="bg-[#fff] text-black py-2 px-4 lg:py-4 lg:px-6 lg:text-lg rounded-lg font-medium hover:bg-[#ea580c] transition"
              >
                Save Changes
              </button>
            </form>

            <button
              onClick={() => {
                setShowEditForm(false);
                setShowDeleteModal(true);
              }}
              className="mt-4 w-full text-red-400 border border-red-400 py-2 lg:py-4 lg:text-lg rounded-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black  z-[999]">
          <div className="bg-[#1f1f1f] p-6 rounded-lg w-[18rem] lg:w-[25rem] relative">
            <h2 className="text-xl lg:text-2xl font-semibold text-red-500 mb-3">
              Delete Account
            </h2>

            <p className="text-sm lg:text-lg text-white mb-4">
              This action is permanent. Type <b>DELETE</b> to confirm.
            </p>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full p-2 lg:p-4 lg:text-lg rounded bg-gray-800 text-white mb-4"
              placeholder="Type DELETE"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 lg:py-4 lg:text-base rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 lg:py-4 lg:text-base rounded hover:bg-red-700 text-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
