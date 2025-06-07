'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type Benefit = {
  title: string;
  description: string;
};

type Testimonial = {
  clientName: string;
  companyName: string;
  description: string;
};

type Plan = {
  name: string;
  price: string;
  features: string;
};

type ProductData = {
  productName: string;
  productLink: string;
  description: string;
  why_choose_des: string;
  who_need_des: string;
  category: string;
  benefits: Benefit[];
  customerTestimonials: Testimonial[];
  plans: Plan[];
};

const ProductUpload: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    productName: "",
    productLink: "",
    description: "",
    why_choose_des: "",
    who_need_des: "",
    category: "",
    benefits: [],
    customerTestimonials: [],
    plans: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewGallery, setPreviewGallery] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "imageUrl" | "gallery"
  ) => {
    const files = Array.from(e.target.files || []);
    const filePreviews = files.map((file) => URL.createObjectURL(file));

    if (type === "imageUrl") {
      setImageFiles(files);
      setPreviewImages(filePreviews);
    } else {
      setGalleryFiles(files);
      setPreviewGallery(filePreviews);
    }
  };

  const addField = (type: "benefits" | "customerTestimonials" | "plans") => {
    let newField: any;

    if (type === "benefits") {
      newField = { title: "", description: "" };
    } else if (type === "customerTestimonials") {
      newField = { clientName: "", companyName: "", description: "" };
    } else {
      newField = { name: "", price: "", features: "" };
    }

    setProductData({ ...productData, [type]: [...productData[type], newField] });
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    type: "benefits" | "customerTestimonials" | "plans",
    field: string
  ) => {
    const updatedFields = [...productData[type]];

    if (type === "benefits") {
      (updatedFields[index] as Benefit)[field as keyof Benefit] = e.target.value;
    } else if (type === "customerTestimonials") {
      (updatedFields[index] as Testimonial)[field as keyof Testimonial] = e.target.value;
    } else if (type === "plans") {
      (updatedFields[index] as Plan)[field as keyof Plan] = e.target.value;
    }

    setProductData({ ...productData, [type]: updatedFields });
  };

  const removeField = (
    index: number,
    type: "benefits" | "customerTestimonials" | "plans"
  ) => {
    const updatedFields = [...productData[type]];
    updatedFields.splice(index, 1);
    setProductData({ ...productData, [type]: updatedFields });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    imageFiles.forEach((file) => formData.append("imageUrl", file));
    galleryFiles.forEach((file) => formData.append("gallery", file));

    Object.keys(productData).forEach((key) => {
      const value = productData[key as keyof ProductData];
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axios.post(`${apiUrl}/api/product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product uploaded successfully!");
      console.log(res.data);
      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      alert("Error uploading product. Please try later.");
    }
  };

  return (
   <div>
     <div className="max-w-3xl mx-auto p-6 md:border border-gray-200 rounded-lg sm:shadow-lg mt-10 ">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={productData.productName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="productLink"
          placeholder="Product Link"
          value={productData.productLink}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="why_choose_des"
          placeholder="Why Choose This?"
          value={productData.why_choose_des}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      
      <h3 className=" text-[16px] md:text-lg">Benefits</h3>
        {productData.benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 px-2  space-x-2 items-center mb-2"
          >
            <input
              type="text"
              placeholder="Title"
              value={benefit.title}
              onChange={(e) => handleFieldChange(e, index, "benefits", "title")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={benefit.description}
              onChange={(e) =>
                handleFieldChange(e, index, "benefits", "description")
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => removeField(index, "benefits")}
              className="text-red-500 flex justify-start w-full"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("benefits")}
          className="bg-black hover:bg-blue-500 text-white px-2 py-1.5 rounded text-sm"
        >
          Add Benefit
        </button>
       

        <textarea
          name="who_need_des"
          placeholder="Who Needs This?"
          value={productData.who_need_des}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={productData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div>
          <label className="block mb-2">Main Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e, "imageUrl")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex space-x-2 mt-2">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`preview-${index}`}
                className="w-16 h-16 rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Product Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e, "gallery")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex space-x-2 mt-2">
            {previewGallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`gallery-${index}`}
                className="w-16 h-16 rounded"
              />
            ))}
          </div>
        </div>



         {/* Customer Testimonials */}
        <h3 className="text-[16px] md:text-lg mt-4">Customer Testimonials</h3>
        {productData.customerTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 px-2 space-x-2 items-center mb-2"
          >
            <input
              type="text"
              placeholder="Client Name"
              value={testimonial.clientName}
              onChange={(e) =>
                handleFieldChange(
                  e,
                  index,
                  "customerTestimonials",
                  "clientName"
                )
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={testimonial.companyName}
              onChange={(e) =>
                handleFieldChange(
                  e,
                  index,
                  "customerTestimonials",
                  "companyName"
                )
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              value={testimonial.description}
              onChange={(e) =>
                handleFieldChange(
                  e,
                  index,
                  "customerTestimonials",
                  "description"
                )
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => removeField(index, "customerTestimonials")}
              className="text-red-500  flex justify-start w-full"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("customerTestimonials")}
          className="bg-black hover:bg-blue-500 text-white px-2 py-1.5 rounded text-sm"
        >
          Add Testimonial
        </button>

        <h3 className="text-lg font-semibold mt-4">Plans</h3>
        {productData.plans.map((plan, index) => (
          <div
            key={index}
            className="flex  flex-col gap-3 px-3 space-x-2 items-center mb-2"
          >
            <input
              type="text"
              placeholder="Plan Name"
              value={plan.name}
              onChange={(e) => handleFieldChange(e, index, "plans", "name")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Price"
              value={plan.price}
              onChange={(e) => handleFieldChange(e, index, "plans", "price")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Features"
              value={plan.features}
              onChange={(e) => handleFieldChange(e, index, "plans", "features")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => removeField(index, "plans")}
              className="text-red-500 flex justify-start w-full"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("plans")}
          className="bg-black hover:bg-blue-500 text-white px-2 py-1.5 rounded text-[14px]">
          Add Plan
        </button>

        <div className="flex justify-between space-x-4 mt-4">
        <button
    type="submit"
    className="w-1/2 bg-black text-white px-4 py-2 rounded hover:bg-green-600 text-[14px]">
    Upload Product
  </button>
  <button
    type="button"
    onClick={() => window.location.href = "/admin"}
    className="w-1/2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-red-600 text-[14px]">
    Cancel
  </button>

</div>

      </form>
    </div>
   </div>
  );
};

export default ProductUpload;
