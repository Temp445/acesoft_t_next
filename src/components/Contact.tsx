'use client';

import React, { useRef, useState, useEffect, FormEvent } from "react";
import { MdAddIcCall, MdOutlineMail, MdOutlineSendToMobile } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { TbPhoneCall } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6"; 
import emailjs from "@emailjs/browser";
import { div } from "framer-motion/client";

const ContactUs: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,6}\.[a-zA-Z]{2,6}$/;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formCurrent = form.current;
    if (!formCurrent) return;

    const emailInput = formCurrent["email"].value;
    if (!emailPattern.test(emailInput)) {
      setEmailError("Please enter a valid email format");
      return;
    } else {
      setEmailError("");
    }

    setLoading(true);

    emailjs
      .sendForm(
        "service_yscbz1z",
        "template_civ87mf",
        formCurrent,
        "9dR2KnJDZ6eO4NSee"
      )
      .then(
        (response) => {
          console.log("Email sent successfully!", response);
          alert("Your message has been sent successfully!");
          formCurrent.reset();
        },
        (error) => {
          console.error("Email sending failed:", error);
          alert("There was an issue sending your message. Please try again later.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
       <div>
      <div className=" mt-0 px-2 " id="contact" >
      <h1 className=" w-full mx-auto text-center mt-0 mb-5 font-semibold  text-xl  md:mb-0 md:text-3xl">Contact <span className="text-blue-500">Us</span></h1>
        <div className="flex flex-col md:flex-row p-4  rounded-lg border md:border-gray-300 max-w-8xl mx-auto sm:mt-10 mb-20 justify-center">
          {/* Left */}
          <div className="md:w-2/3">
            <h2 className="text-lg md:text-3xl font-semibold text-gray-800 mb-6">
            Connect with us and Book a <span className="text-blue-500">Demo today!</span>
            </h2>
            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="lg:text-lg font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="company" className="lg:text-lg font-medium">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name *"
                    className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className="lg:text-lg font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    onChange={(e) => {
                      const emailInput = e.target.value;
                      if (emailPattern.test(emailInput)) {
                        setEmailError("");
                      } else {
                        setEmailError("Please enter a valid email format");
                      }
                    }}
                    className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                  {emailError && (
                    <p className="text-blue-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="number" className="lg:text-lg font-medium">
                    Number
                  </label>
                  <input
                    type="number"
                    name="number"
                    placeholder="Phone Number *"
                    className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    required
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="flex flex-col">
                <label htmlFor="datetime" className="lg:text-lg font-medium">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="datetime"
                  className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                />
              </div>

              <label htmlFor="location" className="lg:text-lg font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <label className="lg:text-lg font-medium">Queries </label>
              <textarea
                name="queries"
                placeholder="Queries *"
                className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-100"
                required
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Right */}
          <div className="hidden lg:block md:w-1/3 md:pl-6 mt-6 md:mt-2 overflow-hidden">
            <h3 className="text-xl font-semibold">Direct Contacts</h3>
            <p className="text-gray-600 text-sm">
              Call or Schedule a video conference
            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdAddIcCall className="mt-1" />
              Support - 44 24795144 <br/>
              Sales - 44 24795145

            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdOutlineSendToMobile  className="mt-1" />
              +91 9840137210
            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdOutlineMail className="mt-1" />
              sales@acesoft.in
            </p>
            <div className="mt-4 space-y-3 overflow-hidden px-3 py-2">
              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="rounded flex items-center gap-4">
                  <HiUserGroup className="text-2xl text-[#f78566]" />
                  <span className="text-black font-medium">
                    Consult with an expert
                  </span>
                </div>
                <p className="text-gray-600 text-sm ml-10">
                  To analyze your needs & provide a demo
                </p>
              </div>

              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <FaLaptopCode className="text-2xl text-[#7066f7]" />
                  <span className="text-black font-medium">
                    Request Custom Developments
                  </span>
                </div>
                <p className="text-gray-700 text-[13px] ml-10">
                  Need to get in touch with developers?
                </p>
              </div>

              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <RiCustomerService2Fill className="text-2xl text-[#6696f7]" />
                  <span className="text-black font-medium">Support Requests</span>
                </div>
                <p className="text-gray-600 text-sm ml-10 mt-1">
                  Have a question? Need assistance?
                </p>
              </div>
            </div>

            <div className="h-0.5 w-2/4 bg-gray-300 rounded-2xl  mx-auto"></div>
            
            <div className="bg-[#f4f5f583] border border-gray-200 p-3 mt-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition mx-3 overflow-hidden">
                <div className="flex items-center gap-3">
                  <FaLocationDot className="text-2xl text-[#F7666F]"/>
                </div>
                <p className="text-gray-600 text-sm ml-10 px-2 -mt-5">
                #306, 2nd Floor NSIC - Software Technology Business Park B 24, Guindy Industrial Estate Ekkaduthangal, Chennai - 600032
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly lg:px-20 items-center gap-6 md:gap-5 lg:gap-5 lg:h-100 px-2 md:px-5 lg:hidden">
        <div className="flex flex-row items-center gap-5 w-full  border p-4 rounded-lg shadow-md">
          <TbPhoneCall className="text-2xl text-red-400 -mt-15" />
          <div>
            <p className="text-sm font-medium text-gray-500">Call Us</p>
            <p className="font-semibold text-[14px] text-black">Support - 44 24795144 <br/>
Sales - 44 24795145 <br/>
Mobile - 97109 46806</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-5 w-full  border p-4 rounded-lg shadow-md">
          <MdOutlineMail className="text-2xl text-red-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email Us</p>
            <p className="font-semibold text-[14px] text-black">sales@acesoft.in</p>
          </div>
        </div>

        <div className="flex flex-row  gap-5 w-full border p-4 rounded-lg shadow-md ">
          <IoLocationOutline className="text-6xl text-red-400 text-bold -mt-5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Visit Us</p>
            <p className=" text-[13px] font-semibold text-black">
            #306, 2nd Floor NSIC - Software Technology Business Park B 24, Guindy Industrial Estate Ekkaduthangal, Chennai - 600032
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
