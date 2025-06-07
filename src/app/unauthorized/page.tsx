"use client"

import React, { useEffect } from "react";

import Header from "@/components/Header";
import Link from "next/link";

export default function Unauthorized() {

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
   <div>
    <Header/>
     <div className="">
      <div className="flex flex-col items-center justify-center text-center px-4 py-20 ">
        <div className=" shadow-md rounded-lg p-8 max-w-lg w-full bg-gray-100 border border-gray-300">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-700 mb-6">
          Sorry, you don’t have access to this page. It’s reserved for <strong>admins only</strong>.
          </p>
          <Link href="/">
            <span className="inline-block bg-blue-400 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
              Go to Home
            </span>
          </Link>
        </div>
      </div>
    </div>
   </div>
  );
}
