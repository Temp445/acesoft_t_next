'use client'

import React from 'react'
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
const Count = () => {  
    const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.7, 
  })

  return (
    <div ref={ref}>
    <div className="mt-2 flex justify-evenly text-center gap-8 lg:mt-0 bg-[#FFF5F5] py-8  rounded-lg mx-auto px-5 ">
    <div>
      <p className="text-xl font-bold lg:text-5xl text-gray-800 overflow-hidden">
      {inView && <CountUp key={inView.toString()} start={0} end={300} duration={5} />}+
      </p>
      <p className="text-gray-600  font-normal text-sm lg:text-xl mr-2">Clients</p>
    </div>
    <div>
      <p className="text-xl font-bold lg:text-5xl overflow-hidden">
      {inView && <CountUp key={inView.toString()} start={0} end={20} duration={5} />}+
      </p>
      <p className="text-gray-600 font-normal  text-sm lg:text-xl mr-2">Years</p>
    </div>
    <div>
      <p className="text-xl font-bold lg:text-5xl overflow-hidden">
      {inView && <CountUp key={inView.toString()} start={0} end={500} duration={5} />}+
      </p>
      <p className="text-gray-600 font-normal  text-sm lg:text-xl mr-2">Projects</p>
    </div>
  </div>
  </div>
  )
}

export default Count