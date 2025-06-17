'use client';

import React, { useRef, useState, useEffect, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendWhatsappMessage } from '@/services/whatsapp/whatsappService';

import { trackConversion } from "../../lib/google";


const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const adminPhones = process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map((p) => p.trim()) || [];



export default function ProductEnquire() {
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const form = useRef<HTMLFormElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

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


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formCurrent = form.current;
    if (!formCurrent) return;

    const emailValidationMessage = await validateEmail(email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);

  emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  emailInputRef.current?.focus();
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

    const checkedProducts = Array.from(formCurrent.querySelectorAll<HTMLInputElement>('input[name="product"]:checked'));
    if (checkedProducts.length === 0) {
      setCheckboxError(true);
      return;
    } else {
      setCheckboxError(false);
    }

    const formData = {
      name: (formCurrent['Name'] as HTMLInputElement)?.value || '',
      company: formCurrent['company']?.value || '',
       email,
      number: phone,
      location: formCurrent['location']?.value || '',
      queries: formCurrent['queries']?.value || '',
      product: checkedProducts.map((p) => p.value).join(', '),
    };

      // Track conversion event for Google Ads
        trackConversion({
            event: 'form_submission',
            form_id: 'enquiry_form',
            form_name: 'Enquiry Form'
        });


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
      <Header />
      <div className="min-h-screen py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-200">
          <h1 className="md:text-3xl font-semibold text-center mb-6">Product Enquiry</h1>
          <form ref={form}  onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                name="Name"
                type="text"
                required
                placeholder="Enter your name *"
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name:</label>
              <input
                name="company"
                type="text"
                placeholder="Enter your company name *"
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Email:</label>
              <input
                ref={emailInputRef}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Enter your email *"
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
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
                className="!shadow-none !bg-transparent rounded-md border mt-1 p-2 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

     
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Location:</label>
              <input
                name="location"
                type="text"
                placeholder="Enter your location *"
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>

         
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Interested:</label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {[
                  'ACE CRM',
                  'ACE Profit PPAP',
                  'PPAP Manager',
                  'ACE Profit ERP',
                  'ACE Profit HRMS',
                  'ACE Projects',
                  'Engineering Balloon Annotator',
                  'ACE Fixed Asset Management (FAM)',
                  'ACE Calibration Management System (CMS)',
                  'ACE Production Management System (PMS)',
                  'ACE Task Management System (TMS)',
                ].map((product) => (
                  <label key={product} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="product"
                      value={product}
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{product}</span>
                  </label>
                ))}
              </div>
              {checkboxError && (
                <p className="text-red-500 text-sm mt-1">Please select at least one product.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Queries:</label>
              <textarea
                name="queries"
                rows={3}
                placeholder="Enter your queries"
                className="mt-1 w-full rounded-md border px-3 py-2"
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
