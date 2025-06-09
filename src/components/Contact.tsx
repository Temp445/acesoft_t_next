'use client';

import React, { useRef, useState, useEffect, FormEvent, ChangeEvent } from "react";
import { MdAddIcCall, MdOutlineMail, MdOutlineSendToMobile } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { TbPhoneCall } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6"; 
import emailjs from "@emailjs/browser";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendWhatsappMessage } from "@/services/whatsapp/whatsappService";

const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const adminPhones = process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map((p) => p.trim()) || [];


const ContactUs: React.FC = () => {
const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const form = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  const validateEmail = async (email: string): Promise<string> => {
    try {
      const response = await fetch('/api/proxy-validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) return 'Email validation failed. Try again.';

      const result = await response.json();
      return result.isValid ? '' : 'Please enter a valid email address.';
    } catch (err) {
      console.error('Email validation error:', err);
      return 'Email validation service unavailable.';
    }
  };

  const handleEmailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value.trim();
    setEmail(emailInput);
    const error = await validateEmail(emailInput);
    setEmailError(error);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formCurrent = form.current;
    if (!formCurrent) return;

    const emailValidationMessage = await validateEmail(email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);
      return;
    } else {
      setEmailError('');
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError('Please enter a valid phone number.');
      return;
    } else {
      setPhoneError('');
    }

    

    const formData = {
      name: (formCurrent['Name'] as HTMLInputElement)?.value || '',
      company: formCurrent['company']?.value || '',
      email,
      number: phone,
      location: formCurrent['location']?.value || '',
      queries: formCurrent['queries']?.value || '',
      product: formCurrent['product']?.value || '',
    };

    setLoading(true);

    try {
      await emailjs.send(service_ID, template_ID, formData, publicKey);
      alert('Your message has been sent successfully!');
      formCurrent.reset();
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('There was an issue sending your message. Please try again later.');
    } finally {
      setLoading(false);
    }

    const phoneWithoutPlus = phone.replace(/^\+/, '');
 
    try {
      await sendWhatsappMessage(
        'enquiry_ace_soft',
        {
          fullName: formData.name,
          companyName: formData.company,
          businessEmail: formData.email,
          mobileNumber: phoneWithoutPlus,
          location: formData.location,
          message: formData.queries,
        },
        adminPhones,
      );

      await sendWhatsappMessage(
        'customer_greetings',
        {
          fullName: formData.name,
          product: formData.product,
          siteUrl: 'https://acesoft.in',
          imageUrl:
            'https://res.cloudinary.com/dohyevc59/image/upload/v1749124753/Enquiry_Greetings_royzcm.jpg',
        },
        [phoneWithoutPlus],
      );
    } catch (error) {
      console.error('WhatsApp sending error:', error);
    }
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
                    onChange={handleEmailChange}
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
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={phone}
                    onChange={setPhone}
                    className="!shadow-none rounded !bg-transparent border mt-1 p-2 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

          
              <div className="flex flex-col">
                <label htmlFor="datetime" className="lg:text-lg font-medium">
                  Product
                </label>
                <input
                  type="text"
                  name="product"
                  placeholder="Enter the product name"
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
                required
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
