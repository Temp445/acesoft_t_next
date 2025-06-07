'use client'

import React from 'react'
import Link from 'next/link'
import { SlCalender } from "react-icons/sl";

const BookCard = () => {
  return (
    <div className=' mt-10 md:mt-14'>
           <div className="w-full  lg:w-full mx-auto px-6 md:px-32 py-8 md:py-10   bg-[url(../assets/Images/blueBg.png)] md:rounded-xl overflow-hidden relative">

              <div className="h-[320px] md:h-96 flex flex-col items-center justify-centerborder bg-white border-gray-300 rounded-xl  p-8 shadow-lg relative">
                <div className="w-20 h-1 rounded-2xl justify-center bg-blue-500"></div>

                <div className='w-20 h-20 bg-blue-200 absolute left-0 top-0  rounded-br-full'></div>
                <div className='w-20 h-20 bg-blue-200 absolute right-0 bottom-0 rounded-tl-full'></div>


                <h1 className=" text-xl md:text-3xl font-extrabold text-center text-gray-800 mb-6 mt-8 md:mt-14 overflow-hidden text-shadow-lg ">
                  Ready to <span className='text-blue-500'>Transform</span> Your Business?
                </h1>
                
                <p className="text-[12px] md:text-lg text-center text-gray-600 max-w-3xl mb-10 overflow-hidden ">
                  Schedule a personalized demo to see how our solutions can address your specific challenges and drive growth for your business.
                </p>
                
                <Link 
                  href="/Demo" 
                  className=" overflow-hidden inline-flex md:mt-8 gap-3 text-sm md:text-lg items-center justify-center px-6 py-3 border border-blue-500  font-medium rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200 shadow-lg "
                >
                  <span className='mb-1'> <SlCalender className='text-xl font-bold'/> </span>  Book a Demo Now
                </Link>
              </div>
            </div>
    </div>
  )
}

export default BookCard