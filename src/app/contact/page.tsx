'use client'

import React, { useRef, useState, useEffect, FormEvent, ChangeEvent } from "react";
import { MdAddIcCall, MdOutlineMail, MdOutlineSendToMobile } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { TbPhoneCall } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6"; 
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";

import PhoneInput, {
  isValidPhoneNumber} from "react-phone-number-input";
import 'react-phone-number-input/style.css';

const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || "";
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const stromxToken = process.env.NEXT_PUBLIC_STROMX_TOKEN || "";
const adminPhones = process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map((p) => p.trim()) || [];

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  number?: string;
  location?: string;
  queries?: string;
}

const ContactUs: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const gmailTypos = [
    'gamil.com', 'gnail.com', 'gmial.com', 'gmaill.com', 'gmail.con',
    'gmail.co', 'gmail.om', 'gmail.cim', 'gmail.cm', 'gmai.com',
    'gmail.comm', 'gmal.com', 'gmaul.com', 'gmail.xom', 'gmail.vom',
    'g.mail.com', 'gmaik.com', 'gmaio.com', 'gmali.com', 'gmali.con',
    'gmail.clm', 'gmail.coom', 'gmaiil.com', 'ggmail.com', 'gemail.com',
    'gmmail.com', 'gmiall.com', 'gmsil.com', 'gmale.com', 'gmall.com',
    'gmil.com', 'gmailc.om', 'gmailc.com', 'gmailm.com', 'gmali.cm',
    'gmalil.com', 'gmial.cm', 'gmaol.com', 'gmauk.com', 'gmaul.co',
    'gmail.ckm', 'gmail.kom', 'gmail.bom', 'gmail.dcom', 'gmaul.con', 'mail.com'
  ];

  const validateEmail = (email: string): string => {
    if (!emailPattern.test(email)) return 'Please enter a valid email address.';
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && gmailTypos.includes(domain)) return 'Did you mean "gmail.com"?';
    return '';
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value.trim();
    setEmail(emailInput);
    const error = validateEmail(emailInput);
    setEmailError(error);
  };

  const sendWhatsAppNotification = async (formData: {
    name: string;
    company: string;
    email: string;
    number: string | undefined;
    location: string;
    queries: string;
  }) => {
    if (!stromxToken || !adminPhones.length) {
      console.warn("Missing Stromx token or admin phone numbers.");
      return;
    }

    const messagePayload = {
      type: "template",
      template: {
        name: "enquiry_ace_acesoft",
        language: { policy: "deterministic", code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: formData.name },
              { type: "text", text: formData.company },
              { type: "text", text: formData.email },
              { type: "text", text: formData.number || "" },
              { type: "text", text: formData.location },
              { type: "text", text: formData.queries },
            ],
          },
        ],
      },
    };

    for (const phone of adminPhones) {
      try {
        const response = await fetch(
          `https://api.stromx.io/v1/message/send-message?token=${stromxToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...messagePayload, to: phone }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.error(`WhatsApp failed for ${phone}:`, data);
        }
      } catch (error) {
        console.error(`WhatsApp error for ${phone}:`, error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    const formElements = form.current.elements as typeof form.current.elements & {
      name: HTMLInputElement;
      company: HTMLInputElement;
      location: HTMLInputElement;
      queries: HTMLTextAreaElement;
    };

    const name = formElements.name.value.trim();
    const company = formElements.company.value.trim();
    const location = formElements.location.value.trim();
    const queries = formElements.queries.value.trim();

    const errors: FormErrors = {};
    let hasErrors = false;

    if (!name) {
      errors.name = "Name is required.";
      hasErrors = true;
    }
    if (!company) {
      errors.company = "Company name is required.";
      hasErrors = true;
    }

    const emailValidationMessage = validateEmail(email);
    if (emailValidationMessage) {
      errors.email = emailValidationMessage;
      setEmailError(emailValidationMessage);
      hasErrors = true;
    } else {
      setEmailError("");
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      errors.number = "Valid phone number is required.";
      setPhoneError("Valid phone number is required.");
      hasErrors = true;
    } else {
      setPhoneError("");
    }

    if (!location) {
      errors.location = "Location is required.";
      hasErrors = true;
    }

    setFormErrors(errors);

    if (hasErrors) {
      return; 
    }

    const formData = {
      name,
      company,
      email,
      number: phone,
      location,
      queries,
    };

    setLoading(true);
    try {
      await Promise.all([
        emailjs.send(service_ID, template_ID, formData, publicKey),
        sendWhatsAppNotification(formData),
      ]);
      alert("Your message has been sent successfully!");
      form.current.reset();
      setPhone(undefined);
      setEmail('');
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="mt-0 px-2">
        <h2 className="sm:hidden w-full mx-auto text-center mt-10 mb-5 font-semibold text-[24px]">
          Contact Us
        </h2>
        <div className="flex flex-col md:flex-row p-4 py-10 md:py-0 rounded-lg border md:border-0 max-w-6xl mx-auto sm:mt-20 mb-20 justify-center">
          <div className="md:w-2/3">
            <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">
              Connect with us and Book a Demo today!
            </h2>
            <form ref={form} onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                    aria-invalid={!!formErrors.name}
                    aria-describedby="name-error"
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
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
                    aria-invalid={!!formErrors.company}
                    aria-describedby="company-error"
                  />
                  {formErrors.company && (
                    <p id="company-error" className="text-red-500 text-sm mt-1">
                      {formErrors.company}
                    </p>
                  )}
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
                    aria-invalid={!!emailError}
                    aria-describedby="email-error"
                  />
                  {emailError && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {emailError}
                    </p>
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

              <label htmlFor="location" className="lg:text-lg font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                aria-invalid={!!formErrors.location}
                aria-describedby="location-error"
              />
              {formErrors.location && (
                <p id="location-error" className="text-red-500 text-sm mt-1">
                  {formErrors.location}
                </p>
              )}

              <label className="lg:text-lg font-medium">Queries </label>
              <textarea
                name="queries"
                placeholder="Queries *"
                className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-100"
                required
                aria-invalid={!!formErrors.queries}
                aria-describedby="queries-error"
              ></textarea>
              {formErrors.queries && (
                <p id="queries-error" className="text-red-500 text-sm mt-1">
                  {formErrors.queries}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#F7666F] text-white px-4 py-2 rounded hover:bg-green-500"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

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
        <div className="flex flex-row items-center gap-5 w-full border p-4 rounded-lg shadow-md">
          <TbPhoneCall className="text-2xl text-red-400 -mt-15" />
          <div>
            <p className="text-sm font-medium text-gray-500">Call Us</p>
            <p className="font-semibold text-[14px] text-black">Support - 44 24795144 <br/>
              Sales - 44 24795145 <br/>
              Mobile - 97109 46806</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-5 w-full border p-4 rounded-lg shadow-md">
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
