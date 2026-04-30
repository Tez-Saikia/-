import React, { useEffect } from "react";
import Nav from "../Nav/Nav";
import "../../Fonts.css";
import Footer from "../Footer/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Aos from "aos";
import "aos/dist/aos.css";

function Faqs() {
  useEffect(() => {
    Aos.init({ once: true, duration: 2000 });
  });

  return (
    <div className="bg-[#181716]">
      <h1
        className="text-center merriweather-bold text-[#fff] pt-[4rem] custom-xsm:text-lg md:text-2xl"
        data-aos="fade-up"
      >
        FAQs
      </h1>

      <div
        className="flex justify-center items-center lg:pt-12 pt-8"
        data-aos="fade-up"
      >
        <div className="sm:w-1/2 md:w-3/4 px-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] text-sm md:text-[1rem] lg:text-xl tracking-wider">
                What types of photography services do you offer?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                We specialize in a wide range of photography services including
                portraits, weddings, events, commercial, and landscape
                photography. Whether you're looking for a professional headshot
                or capturing the special moments of your big day, we've got you
                covered.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                How do I book a session with you?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Booking a session is easy! You can contact me via my website's
                contact form, give me a call, or reach out through Facebook,
                Instagram, WhatsApp, or email. We'll discuss your needs, check
                availability, and schedule your session at a convenient time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Do you offer photo editing and retouching?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Yes, all of our packages include professional photo editing and
                retouching to ensure your images look their best.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Can I order prints and albums?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Absolutely! We offer a variety of print options and custom photo
                albums. You can select your favorite images and we'll take care
                of the rest.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                How long have you been a professional photographer?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                I have been a professional photographer for over 12 years,
                capturing moments and telling stories through my lens.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider">
                Where did you study photography?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                I studied photography at PVTI Institute of Photography in
                Guwahati, where I received comprehensive training and developed
                my technical and creative skills.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Where is your office/studio?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                We have our office in Balipukhuri Tiniali in Tezpur, Assam, but
                are available for shoots across the globe.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Which cameras/equipment do you use?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                I use a combination of the Canon 5D Mark IV and the Canon R6 for
                my photography. These cameras offer exceptional image quality,
                reliability, and versatility, allowing me to capture stunning
                photos in various conditions. The Canon 5D Mark IV is my go-to
                for detailed, high-resolution shots, while the Canon R6 excels
                in low-light situations and offers incredible speed and
                performance. Together, they provide a perfect balance for any
                type of shoot.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Do you bring your own lights?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Yes, I provide professional lighting for all my shoots. This
                ensures that each scene is perfectly illuminated, allowing me to
                capture the best possible images. With high-quality lighting
                equipment at my disposal, I'm fully prepared to create the
                perfect lighting setup for any situation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Do you provide/arrange for makeup services?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Yes, I can provide or arrange for professional makeup services
                for my shoots. This ensures that all subjects look their best
                and are camera-ready. Whether you need natural, everyday makeup
                or something more glamorous, we've got you covered.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Do you only shoot weddings?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                While I love capturing the special moments of weddings, my
                services extend far beyond that. I offer a wide range of
                photography and videography services, including portraits,
                events, commercial projects, travel, and more. Whether it's a
                corporate event, a family portrait, or a creative video project,
                I bring the same level of passion and professionalism to every
                shoot. My diverse experience allows me to adapt to various
                styles and requirements, ensuring that each client's vision is
                beautifully realized.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline font-extrabold text-[#fff] md:text-[1rem] lg:text-xl tracking-wider ">
                Why should we hire you?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-[.9rem] lg:text-[1rem] alegreya-sans-black tracking-wider text-[#fff]">
                Hiring us means choosing a team that is dedicated, passionate,
                and versatile. With years of experience in a wide range of
                photography and videography, we bring a unique blend of
                technical expertise and creative vision to every project. We
                pride ourselves on delivering high-quality images that tell
                compelling stories and capture unforgettable moments. We also
                understand that each client has their own unique needs and
                preferences, so we tailor our approach to ensure that your
                vision is fully realized.
                <br />
                <br />
                Moreover, we offer a comprehensive suite of services, including
                professional lighting and the ability to arrange makeup
                services, ensuring that every aspect of the shoot is perfectly
                coordinated. Whether it's a wedding, corporate event, portrait
                session, or a creative video project, you can trust that we will
                provide exceptional results with a personal touch. Your
                satisfaction is our top priority, and we are committed to
                exceeding your expectations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Faqs;
