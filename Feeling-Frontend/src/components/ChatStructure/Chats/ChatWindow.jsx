import { useState, useEffect, useRef, useMemo } from "react";
import { Paperclip, Trash2, Pencil } from "lucide-react";
import { IoIosSend } from "react-icons/io";
import ChatPageHeader from "./ChatPageHeader";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserChatStore } from "@/store/useUserChatStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminChatStore } from "@/store/useAdminChatStore";

import useKeyboardSound from "../useKeyboardSound/useKeyboardSound.js";

import EmojiPicker from "emoji-picker-react";
import { Smile, Download } from "lucide-react";

import { useParams } from "react-router-dom";
import { socket } from "@/lib/socket";

function ChatWindow({
  messages,
  conversation,
  onSend,
  deleteMessage,
  editMessage,
  isAdmin = false,
  HeaderComponent = ChatPageHeader,
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const [showChatEmoji, setShowChatEmoji] = useState(false);
  const [showCaptionEmoji, setShowCaptionEmoji] = useState(false);

  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [selectedUploadIndex, setSelectedUploadIndex] = useState(0);

  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const [activeMessage, setActiveMessage] = useState(null);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const authUser = useAuthStore((state) => state.authUser);
  const isSoundEnabled = useUserChatStore((state) => state.isSoundEnabled);
  const adminUser = useAdminAuthStore((state) => state.adminData);

  const hasConversation = messages.length > 0;

  const currentUserId = useMemo(() => {
    return String(isAdmin ? adminUser?._id : authUser?._id || "");
  }, [isAdmin, adminUser?._id, authUser?._id]);

  console.log("🔥 ChatWindow props:", {
    isAdmin,
    path: window.location.pathname,
  });

  const currentUser = isAdmin ? adminUser : authUser;

  const isMyMessage = (msg) => {
    if (!msg) return false;

    const senderId =
      typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;

    return String(senderId) === String(currentUserId);
  };

  const messageInputRef = useRef(null);
  const captionInputRef = useRef(null);

  const { playRandomStrokeSound } = useKeyboardSound();

  const { conversationId } = useParams();

  const [is2xl, setIs2xl] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIs2xl(window.innerWidth >= 1536);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const isReadByOtherPerson = (msg) => {
    if (!msg.readBy || !currentUserId) return false;

    return msg.readBy.some((r) => String(r.userId) !== String(currentUserId));
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  useEffect(() => {
    if (!fullscreenMedia) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) =>
          prev === fullscreenMedia.length - 1 ? 0 : prev + 1,
        );
      }

      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) =>
          prev === 0 ? fullscreenMedia.length - 1 : prev - 1,
        );
      }

      if (e.key === "Escape") {
        setFullscreenMedia(null);
        setFullscreenIndex(0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenMedia]);

  useEffect(() => {
    const closeActiveMessage = () => {
      setActiveMessage(null);
    };

    window.addEventListener("click", closeActiveMessage);

    return () => window.removeEventListener("click", closeActiveMessage);
  }, []);

  const allMedia = useMemo(() => {
    return messages.flatMap((msg) =>
      (msg.media || []).map((m) => ({
        ...m,
        type: m.type || (m.url?.includes("video") ? "video" : "image"),
        messageId: msg._id,
      })),
    );
  }, [messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = () => {
    if (!uploadCaption && !message && files.length === 0) return;

    setShowChatEmoji(false);
    setShowCaptionEmoji(false);

    onSend({
      content: uploadCaption || message,
      files: files.map((f) => f.file),
    });

    setMessage("");
    setFiles([]);
    setUploadCaption("");
    setSelectedUploadIndex(0);
    setShowUploadPreview(false);

    if (messageInputRef.current) {
      messageInputRef.current.style.height = "auto";
    }

    messageInputRef.current?.focus();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const mappedFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    if (mappedFiles.length > 0) {
      setFiles((prev) => [...prev, ...mappedFiles]);
      setShowUploadPreview(true);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!fullscreenMedia) return;
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      setFullscreenIndex((prev) =>
        prev === fullscreenMedia.length - 1 ? 0 : prev + 1,
      );
    } else if (distance < -minSwipeDistance) {
      setFullscreenIndex((prev) =>
        prev === 0 ? fullscreenMedia.length - 1 : prev - 1,
      );
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      if (showChatEmoji || showCaptionEmoji) {
        setShowChatEmoji(false);
        setShowCaptionEmoji(false);
        return;
      }

      handleSend();
    }
  };

  const handleEmojiClick = (emojiData, event) => {
    event?.stopPropagation();

    if (showUploadPreview) {
      setUploadCaption((prev) => prev + emojiData.emoji);
    } else {
      setMessage((prev) => prev + emojiData.emoji);
    }

    setShowChatEmoji(false);
    setShowCaptionEmoji(false);

    setTimeout(() => {
      if (showUploadPreview) {
        captionInputRef.current?.focus();
      } else {
        messageInputRef.current?.focus();
      }
    }, 10);
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "media";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const markAsRead = useUserChatStore((state) => state.markAsRead);

  const typingUser = useAdminChatStore((s) => s.typingUser);

  useEffect(() => {
    if (!conversationId || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    const getSenderId = (senderId) =>
      typeof senderId === "object" ? senderId?._id : senderId;

    if (String(getSenderId(lastMsg.senderId)) !== String(currentUserId)) {
      markAsRead(conversationId);
    }
    {
      markAsRead(conversationId);
    }
  }, [messages]);

  // console.log("IS ADMIN:", isAdmin);
  // console.log("AUTH USER:", authUser?._id);
  // console.log("ADMIN USER:", adminUser?._id);
  // console.log("CURRENT USER ID:", currentUserId);

  return (
    <div className="w-full h-full bg-[#181716] flex flex-col">
      <HeaderComponent />

      {typingUser && (
        <p className="text-sm text-gray-400 px-4 py-2">
          {typingUser} is typing...
        </p>
      )}

      <div className="flex flex-col flex-1 pt-[1rem]">
        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1 px-4 space-y-4 pb-32 custom-xxl:pb-40 bg-[#181716] scroll-smooth"
        >
          {!hasConversation && currentUser && (
            <div className="flex items-center justify-center h-full text-center text-gray-400 px-6 lg:text-xl custom-xxl:text-2xl">
              {isAdmin ? (
                <p className="text-white text-lg">No conversation yet</p>
              ) : (
                <div className="max-w-md leading-relaxed space-y-5 lg:max-w-3xl">
                  <p className="text-white font-alegreya">
                    Hello{" "}
                    {
                      (
                        currentUser?.name ||
                        currentUser?.username ||
                        "User"
                      ).split(" ")[0]
                    }{" "}
                    !
                  </p>

                  <p className="text-white">Let us know what's on your mind.</p>

                  <p className="text-white">
                    Whether you're planning a wedding shoot, a creative portrait
                    session, or simply exploring your options, we're here to
                    help you capture the perfect moment.
                  </p>

                  <p className="text-white">
                    Ask away — we're ready when you are. ✨📷
                  </p>
                </div>
              )}
            </div>
          )}

          {messages.map((msg) => {
            const isMine = isMyMessage(msg);

            // console.log("CHECK MSG:", {
            //   senderId: msg.senderId,
            //   senderModel: msg.senderModel,
            //   currentUserId,
            //   isMine: isMyMessage(msg),
            // });

            // console.log(
            //   "FINAL RENDER:",
            //   messages.map((m) => ({
            //     id: m._id,
            //     senderId: m.senderId,
            //     senderModel: m.senderModel,
            //   })),
            // );
            return (
              <div
                key={msg._id}
                className={`flex items-start gap-2 group ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!msg.deleted && isMine && activeMessage === msg._id && (
                  <div className="flex items-center gap-2 mt-5">
                    {msg.content && (!msg.media || msg.media.length === 0) && (
                      <button
                        onClick={() => {
                          const newText = prompt(
                            "Edit your message:",
                            msg.content,
                          );
                          if (newText && newText.trim() !== msg.content) {
                            editMessage(msg._id, newText);
                          }
                        }}
                        className="text-gray-300"
                      >
                        <Pencil className="w-4 h-4 custom-xxl:w-6 custom-xxl:h-6" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-gray-300 "
                    >
                      <Trash2 className="w-4 h-4 custom-xxl:w-6 custom-xxl:h-6" />
                    </button>
                  </div>
                )}

                {/* MESSAGE BUBBLE */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMessage((prev) =>
                      prev === msg._id ? null : msg._id,
                    );
                  }}
                  className={`relative max-w-[75%] text-white px-4 py-3 rounded-2xl break-words whitespace-pre-wrap cursor-default custom-xxl:px-8 custom-xxl:py-7  2xl:px-2 2xl:py-2 hover:cursor-pointer ${
                    isMine ? "bg-gray-500" : "bg-gray-800"
                  }`}
                >
                  {msg.content && (
                    <p className="mb-2 text-sm lg:text-lg custom-xxl:text-[1.7rem] 2xl:text-lg">
                      {msg.content}
                      {msg.edited && (
                        <span className="text-[10px] lg:text-[15px] custom-xxl:text-base 2xl:text-xs opacity-60 ml-2">
                          (edited)
                        </span>
                      )}
                    </p>
                  )}
                  {msg.media && msg.media.length > 0 && (
                    <div
                      className={`grid gap-2 mt-2 ${
                        msg.media.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2 place-items-center"
                      }`}
                    >
                      {msg.media.map((m, index) => (
                        <div key={index}>
                          {m.type === "image" ? (
                            <img
                              src={m.url}
                              alt=""
                              onClick={(e) => {
                                e.stopPropagation();

                                const globalIndex = allMedia.findIndex(
                                  (media) => media.url === m.url,
                                );

                                setFullscreenMedia(allMedia);
                                setFullscreenIndex(globalIndex);
                              }}
                              className="rounded-xl max-h-60 custom-xxl:max-h-[25rem] object-cover cursor-pointer"
                            />
                          ) : (
                            <video
                              src={m.url}
                              onClick={(e) => {
                                e.stopPropagation();

                                const globalIndex = allMedia.findIndex(
                                  (media) => media.url === m.url,
                                );

                                setFullscreenMedia(allMedia);
                                setFullscreenIndex(globalIndex);
                              }}
                              className="rounded-xl max-h-60 custom-xxl:max-h-[25rem] cursor-pointer"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[9px] lg:text-[12px] custom-xxl:text-lg 2xl:text-xs opacity-60 mt-1 flex items-center gap-1 justify-end whitespace-nowrap">
                    {formatTime(msg.createdAt)}

                    {isMine && (
                      <span
                        className={`text-[11px] lg:text-[13px] custom-xxl:text-xl 2xl:text-sm ${
                          isReadByOtherPerson(msg)
                            ? "text-blue-300"
                            : "text-gray-200"
                        }`}
                      >
                        {msg.isTemp ? (
                          <span className="text-[10px] text-gray-400 ml-1">
                            {msg.progress > 0 ? `${msg.progress}%` : "⏳"}
                          </span>
                        ) : (
                          <span
                            className={`ml-1 ${
                              isReadByOtherPerson(msg)
                                ? "text-blue-300"
                                : "text-gray-200"
                            }`}
                          >
                            {isReadByOtherPerson(msg) ? "✓✓" : "✓"}
                          </span>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT SECTION */}
        {(!isAdmin || hasConversation) && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#181716] z-40 ">
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-end gap-3 ">
                <div className="relative flex-1 rounded-full custom-xxl:rounded-full overflow-hidden bg-[#404040]">
                  <textarea
                    ref={messageInputRef}
                    rows={1}
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);

                      socket.emit("typing", {
                        conversationId,
                        user: currentUser?.name || "User",
                      });

                      setTimeout(() => {
                        socket.emit("stop-typing", { conversationId });
                      }, 1000);

                      if (isSoundEnabled) {
                        playRandomStrokeSound();
                      }

                      const el = e.target;
                      requestAnimationFrame(() => {
                        el.style.height = "auto";
                        el.style.height = Math.min(el.scrollHeight, 120) + "px";
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey) return;

                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="w-full bg-transparent text-white rounded-3xl  pl-12 pr-14 py-2 lg:pl-16 lg:pr-20 lg:py-4 lg:text-lg  outline-none resize-none placeholder-gray-400 max-h-[120px] overflow-y-auto leading-relaxed text-sm custom-xxl:py-8 custom-xxl:text-3xl custom-xxl:pl-24 custom-xxl:pr-20 2xl:py-4 2xl:text-lg 2xl:pl-16 2xl:pr-20 "
                  />

                  {/* Paperclip */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute left-4 bottom-4 text-gray-400 hover:text-white lg:bottom-5 custom-xxl:bottom-9 custom-xxl:left-8 2xl:bottom-6 2xl:left-4"
                  >
                    <Paperclip className="w-4 h-4 lg:w-6 lg:h-6 custom-xxl:w-9 custom-xxl:h-9 2xl:w-9 2xl:h-6" />
                  </button>

                  {/* Emoji */}
                  <button
                    onClick={() => {
                      setShowChatEmoji((prev) => !prev);
                      setShowCaptionEmoji(false);
                    }}
                    className="absolute right-4 bottom-4 text-gray-400 hover:text-white lg:bottom-5 custom-xxl:bottom-9 custom-xxl:right-8 2xl:bottom-6 2xl:right-4"
                  >
                    <Smile className="w-4 h-4 lg:w-6 lg:h-6 custom-xxl:w-9 custom-xxl:h-9 2xl:w-9 2xl:h-6" />
                  </button>
                </div>

                {/* send button */}
                <button
                  onClick={handleSend}
                  className="w-10 h-10 lg:w-14 lg:h-14 custom-xxl:w-24 custom-xxl:h-24 2xl:w-14 2xl:h-14 flex items-center justify-center  rounded-full bg-[#d5d5d5] hover:bg-white transition shadow-sm relative -top-1"
                >
                  <IoIosSend className="w-4 h-4 lg:w-7 lg:h-7 custom-xxl:w-12 custom-xxl:h-12 2xl:w-7 2xl:h-7 text-gray-700" />
                </button>
              </div>

              {/* EMOJI PICKER */}
              {showChatEmoji && (
                <div className="absolute bottom-20 right-0 z-50 custom-xxl:right-5 custom-xxl:bottom-28">
                  <EmojiPicker
                    width={is2xl ? 300 : 500}
                    height={is2xl ? 450 : 550}
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD PREVIEW */}
      {showUploadPreview && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center px-6 py-6 z-50">
            <button
              onClick={() => {
                setShowUploadPreview(false);
                setFiles([]);
              }}
              className="text-white text-4xl"
            >
              ✕
            </button>

            <button
              onClick={() => {
                const updated = files.filter(
                  (_, i) => i !== selectedUploadIndex,
                );

                if (updated.length === 0) {
                  setShowUploadPreview(false);
                  setFiles([]);
                  setSelectedUploadIndex(0);
                } else {
                  setFiles(updated);
                  setSelectedUploadIndex((prev) =>
                    prev >= updated.length ? 0 : prev,
                  );
                }
              }}
              className="text-white text-3xl"
            >
              <Trash2 />
            </button>
          </div>

          {/* MAIN PREVIEW */}
          <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
            {files[selectedUploadIndex]?.type === "image" ? (
              <img
                src={files[selectedUploadIndex]?.preview}
                alt=""
                className="max-h-[65vh] object-contain"
              />
            ) : (
              <video
                src={files[selectedUploadIndex]?.preview}
                controls
                autoPlay
                className="max-h-[65vh] object-contain"
              />
            )}
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 px-4 py-3 overflow-x-auto bg-black">
            {files.map((f, index) => (
              <div key={index} className="relative">
                {f.type === "image" ? (
                  <img
                    src={f.preview}
                    alt=""
                    onClick={() => setSelectedUploadIndex(index)}
                    className={`w-16 h-16 custom-xxl:w-40 custom-xxl:h-40  2xl:w-24 2xl:h-24 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedUploadIndex === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  />
                ) : (
                  <video
                    src={f.preview}
                    onClick={() => setSelectedUploadIndex(index)}
                    className={`w-16 h-16 custom-xxl:w-40 custom-xxl:h-40 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedUploadIndex === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  />
                )}
              </div>
            ))}

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-16 h-16 custom-xxl:w-40 custom-xxl:h-40 custom-xxl:text-4xl 2xl:w-24 2xl:h-24 2xl:text-xl border-2 border-dashed border-gray-400 rounded-lg text-white text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* CAPTION */}
          <div className="flex items-center gap-3 p-4 bg-[#111] relative">
            <input
              ref={captionInputRef}
              type="text"
              placeholder="Add a caption..."
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#20202c] w-7 text-white rounded-3xl px-4 py-3 custom-xxl:px-9 custom-xxl:py-8 custom-xxl:rounded-full custom-xxl:text-xl 2xl:px-5 2xl:py-4 2xl:text-sm outline-none"
            />

            <button
              onClick={() => {
                setShowCaptionEmoji((prev) => !prev);
                setShowChatEmoji(false);
              }}
              className="text-gray-400 hover:text-white transition"
            >
              <Smile className="size-[22px] custom-xxl:size-[37px] 2xl:size-[22px]" />
            </button>

            <button
              onClick={handleSend}
              className="bg-green-500 text-black px-6 py-2 rounded-full font-bold custom-xxl:px-9 custom-xxl:py-4 custom-xxl:text-xl  2xl:px-5 2xl:py-2 2xl:text-sm"
            >
              Send
            </button>

            {showCaptionEmoji && (
              <div className="absolute bottom-20 right-4 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHAT */}
      {fullscreenMedia && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* CLOSE BUTTON */}
          <button
            onClick={() => {
              setFullscreenMedia(null);
              setFullscreenIndex(0);
            }}
            className="absolute top-6 right-6 text-white text-4xl z-50"
          >
            ✕
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={() => {
              const currentMedia = fullscreenMedia[fullscreenIndex];

              deleteMessage(currentMedia.messageId);

              const updated = fullscreenMedia.filter(
                (_, i) => i !== fullscreenIndex,
              );

              if (updated.length === 0) {
                setFullscreenMedia(null);
                setFullscreenIndex(0);
              } else {
                setFullscreenMedia(updated);
                setFullscreenIndex((prev) =>
                  prev === updated.length ? 0 : prev,
                );
              }
            }}
            className="absolute top-6 left-6 text-white text-2xl z-50 px-4 py-2 rounded-full transition"
          >
            <Trash2 />
          </button>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={() => handleDownload(fullscreenMedia[fullscreenIndex].url)}
            className="absolute top-6 left-24 flex items-center gap-2 text-white z-50 bg-black/60 hover:bg-black/90 transition px-4 py-2 rounded-full shadow-lg"
          >
            <Download className="w-6 h-6" />
            <span className="text-sm">Download</span>
          </button>

          {/* LEFT ARROW */}
          {fullscreenMedia.length > 1 && (
            <button
              onClick={() =>
                setFullscreenIndex((prev) =>
                  prev === 0 ? fullscreenMedia.length - 1 : prev - 1,
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-5xl z-50 bg-black/40 hover:bg-black/70 transition px-4 py-2 rounded-full"
            >
              ‹
            </button>
          )}

          {/* RIGHT ARROW */}
          {fullscreenMedia.length > 1 && (
            <button
              onClick={() =>
                setFullscreenIndex((prev) =>
                  prev === fullscreenMedia.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-5xl z-50 bg-black/40 hover:bg-black/70 transition px-4 py-2 rounded-full"
            >
              ›
            </button>
          )}

          {/* MEDIA DISPLAY */}
          <div
            className="flex items-center justify-center w-full h-full p-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {fullscreenMedia[fullscreenIndex].type === "image" ? (
              <img
                src={fullscreenMedia[fullscreenIndex].url}
                alt=""
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            ) : (
              <video
                src={fullscreenMedia[fullscreenIndex].url}
                controls
                autoPlay
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
