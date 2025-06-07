'use client';

import React, { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const stromxToken = process.env.NEXT_PUBLIC_STROMX_TOKEN || '';
const adminPhones = process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map((p) => p.trim()) || [];

type FormErrors = {
  name?: string;
  company?: string;
  email?: string;
  number?: string;
  location?: string;
};

export default function ProductEnquire() {
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const form = useRef<HTMLFormElement | null>(null);

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
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.';
    }
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && gmailTypos.includes(domain)) {
      return 'Did you mean "gmail.com"?';
    }
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
    number: string;
    location: string;
    queries: string;
  }) => {
    if (!stromxToken || adminPhones.length === 0) {
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
              { type: "text", text: formData.number },
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

    const formElements = form.current.elements as any; // to access by name
    const name = formElements.namedItem('name')?.value.trim() || '';
    const company = formElements.namedItem('company')?.value.trim() || '';
    const location = formElements.namedItem('location')?.value.trim() || '';
    const queries = formElements.namedItem('queries')?.value.trim() || '';

    // checkbox group named "product"
    const productElements = form.current.querySelectorAll('input[name="product"]:checked') as NodeListOf<HTMLInputElement>;
    const selectedProducts = Array.from(productElements).map(el => el.value);
    const product = selectedProducts.join(', ');

    const errors: FormErrors = {};
    if (!name) errors.name = "Name is required.";
    if (!company) errors.company = "Company name is required.";
    const emailValidationMessage = validateEmail(email);
    if (emailValidationMessage) errors.email = emailValidationMessage;
    if (!phone || !isValidPhoneNumber(phone)) {
      errors.number = "Valid phone number is required.";
    }
    if (!location) errors.location = "Location is required.";

    if (selectedProducts.length === 0) {
      setCheckboxError(true);
    } else {
      setCheckboxError(false);
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0 || selectedProducts.length === 0) {
      alert("Please fill out all required fields correctly.");
      return;
    }

   interface FormData {
  name: string;
  company: string;
  email: string;
  number: string;
  location: string;
  product: string;
  queries: string;
  [key: string]: string;  // <-- index signature to satisfy emailjs
}


  const formData: FormData = {
  name,
  company,
  email,
  number: phone || '',
  location,
  product,
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
      setPhone('');
      setEmail('');
      setFormErrors({});
      setEmailError('');
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
      <div className="min-h-screen py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-200">
          <h1 className="md:text-3xl font-semibold text-center mb-6">
            Product Enquiry
          </h1>
          <form ref={form} noValidate onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name *"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name:</label>
              <input
                name="company"
                type="text"
                placeholder="Enter your company name *"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Email:</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email *"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
              <PhoneInput
                international
                defaultCountry="IN"
                name="number"
                value={phone}
                onChange={setPhone}
                className="!shadow-none !bg-transparent rounded-md border border-gray-300 mt-1 p-2 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
              />
              {formErrors.number && <p className="text-red-500 text-sm mt-1">{formErrors.number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Location:</label>
              <input
                name="location"
                type="text"
                placeholder="Enter your location *"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Interested:</label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {[
                  "ACE CRM",
                  "ACE Profit PPAP",
                  "PPAP Manager",
                  "ACE Profit ERP",
                  "ACE Profit HRMS",
                  "ACE Projects",
                  "Engineering Balloon Annotator",
                  "ACE Fixed Asset Management (FAM)",
                  "ACE Calibration Management System (CMS)",
                  "ACE Production Management System (PMS)",
                  "ACE Task Management System (TMS)",
                ].map((product) => (
                  <label key={product} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="product"
                      value={product}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{product}</span>
                  </label>
                ))}
              </div>
              {checkboxError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one product.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Queries:</label>
              <textarea
                name="queries"
                rows={3}
                placeholder="Enter your queries"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex">
              <button
                type="submit"
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-green-500"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
