'use client'

import React from "react";
import { motion } from "framer-motion";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { FaAward } from "react-icons/fa";
import { AiTwotoneMessage } from "react-icons/ai";
import { ImFlag } from "react-icons/im";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiCustomerService2Fill } from "react-icons/ri";
import Vision from "../assets/Images/vision1.png";
import Values from "../assets/Images/values.png";
import Mission from "../assets/Images/mission.png";
import Pic1 from "../assets/Images/Rajagopalan.png";
import Pic2 from "../assets/Images/Rajasekaran.jpg";
import Pic3 from "../assets/Images/Abilash.png";
import Pic4 from "../assets/Images/Abishek.png";
import Pic5 from "../assets/Images/Anandh1.jpg";
import { FaUserTie } from "react-icons/fa6";

import Image from "next/image";
import Count1 from "./Count1";

const AboutPage1 = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const reasonsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container w-full mx-auto " id="about">

<motion.h1
            className=" w-full mx-auto justify-center text-blue items-center text-center text-2xl overflow-hidden z-10 rounded-2xl font-extrabold  relative inline-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}  >
            About Us
            <motion.div
              className="h-1 w-2 bg-blue-500 mx-auto mt-1 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              transition={{ delay: 0.3, duration: 0.6 }} />
          </motion.h1>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex-wrap mt-4 text-justify sm:text-center justify-center px-5 lg:px-20 2xl:px-40 h-auto py-5 xl:mt-10"
      >

<motion.p variants={itemVariants} className="py-2 text-[12px] sm:text-[16px] lg:text-lg">
     <span className="text-blue-500">ACE Software Solutions Pvt. Ltd;</span> a company incorporated in 2001, has its Head Office and its Research &
            Development center in Chennai. The company was started by
            professionals having rich experience in the Manufacturing sector.{" "}
        </motion.p>
        <motion.p variants={itemVariants} className="py-2 text-[12px] sm:text-[16px] lg:text-lg">
          The ASSPL Management Team has hands on experience in designing and
          implementation of{" "}
          <span className="text-blue-500">
            {" "}
            ERP systems, Industry 4.0 & IIOT Solutions and SAAS model products
          </span>{" "}
          for small, medium and large industries and corporate.
        </motion.p>
        <motion.p variants={itemVariants} className="py-2 hidden sm:text-sm lg:block lg:text-lg " >
          Further the ASSPL Management Team possess functional expertise and
          process knowledge of various segments of industry like Automotive,
          Aerospace, Foundry, Leather and Project Management. The ASSPL
          Management Team has an edge over the others in understanding the
          industry requirements towards various Quality system accreditations,
          the client has to comply, since they were also instrumental in getting
          accreditations (ISO, TS and Environmental) done for large industrial
          houses.
        </motion.p>
        <motion.p  variants={itemVariants} className="text-[12px] sm:text-[16px] lg:hidden">
          The ASSPL Management Team has expertise in Automotive, Aerospace,
          Foundry, Leather, and Project Management industries. Their deep
          understanding of quality system accreditations like ISO, TS, and
          Environmental standards gives them a competitive edge, having
          successfully guided large industries in achieving these
          certifications.
        </motion.p>
        <motion.p variants={itemVariants} className="py-2 text-[12px] sm:text-[16px] lg:text-lg">
          The Development team is highly capable of providing a readymade
          solution to small and medium industries in quick time, at the same
          time taking care of providing tailor made solutions to suit the
          requirements of large industries.
        </motion.p>
      </motion.div>

       <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex flex-wrap justify-evenly w-full  md:px-10 xl:mt-10 gap-10 py-5 md:py-20"
      >
        {[
          { img: Vision, 
            title: "Our Vision", 
            description: "To reach, connect and provide Technology Products – IIOT – Industry 4.0 solution and SAAS Model Products to the industry and corporate segments of all sizes that always strive to exceed their expectations." },
          { img: Mission, 
            title: "Our Mission", 
            description: "Provide the world's best Technology Products and SAAS Model solutions that enable businesses to excel." },
          { img: Values, 
            title: "Our Values", 
            description: "We provide solutions that meet customer needs, take responsibility for our work, deliver on time, and strive for excellence, stability, and growth." }
        ].map((item, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants} 
            className="w-96"
          >
            <div className="border border-gray-300 rounded-2xl overflow-hidden">
              <Image src={item.img} alt={item.title} className="w-full h-48 object-cover" />
            </div>
            <h1 className="mt-4 text-[16px] sm:text-lg font-semibold">{item.title}</h1>
            <p className="mt-2 text-gray-600 text-[12px] sm:text-sm">{item.description}</p>
          </motion.div>
        ))}
      </motion.div> 

      <div className="mt-0 mb-5 md:mt-10">
        <Count1/>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mt-10 xl:mt-20 px-4"
      >
        <h1 className="text-blue-500 text-sm sm:text-xl">
          Why choose us <br />
          <span className="text-black font-semibold text-sm sm:text-xl">
            6 REASONS TO PARTNER WITH ACE Software Solutions
          </span>
        </h1>

        <motion.div 
          variants={containerVariants}
          className="flex justify-evenly items-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 xl:gap-32 mt-10">
            {[
              { icon: ImFlag,
              title: "Experts in Engineering Software",
              description: "Since 2001, we've been building cutting-edge engineering and custom software solutions tailored for businesses like yours." },
              { icon: FaPeopleGroup, 
                title: "Highly Skilled & Experienced Team", 
                description: "Our experts specialize in automation, enterprise software, and engineering solutions, delivering reliable and efficient results." },
              { icon: AiTwotoneMessage, 
                title: "Fast & Dependable Support", 
                description: "We provide timely assistance to minimize downtime and keep your operations running smoothly—no unnecessary delays." },
              { icon: BsFillEmojiSmileFill, 
                title: "Trusted by Businesses Worldwide", 
                description: "With over two decades of experience, we focus on quality, reliability, and long-term partnerships to ensure your success." },
              { icon: FaAward, 
                title: "Tailored Software for Your Needs", 
                description: "From engineering tools to enterprise solutions like CRM and PPAP, we design software that perfectly fits your business." },
              { icon: RiCustomerService2Fill, 
                title: "Simplified, User-Friendly Technology", 
                description: "We make complex technology easy to use, delivering intuitive solutions that integrate seamlessly into your workflow." }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={reasonsVariants}
                className="flex flex-col items-start space-y-2"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="text-sm sm:text-2xl" />
                  <h1 className="text-sm md:text-[16px] font-semibold">{item.title}</h1>
                </div>
                <p className="text-justify text-[12px] md:text-sm w-full sm:w-60 ml-8 flex flex-wrap pe-10 md:pe-0 text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="bg-gray-100 mt-20 h-auto pb-16 rounded-xl">
  <h1 className="flex w-full justify-center py-5 font-bold text-[20px] lg:text-[24px] text-gray-800 mt-10">
  Our Leadership Team
  </h1>

  <div className="lg:mt-0 px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-3">
      {[
        {
          name: "R Rajagopalan",
          img: Pic1,
          position: "Chairman of ACE Software Solutions Pvt. Ltd",
          description:
            "With over 30 years of experience in the automobile industry, specializing in Industrial Engineering, Production Planning, Shop Floor Systems, and Materials Management, he provides strategic inputs for the organizational growth of ASSPL.",
        },
        {
          name: "S Rajasekaran",
          img: Pic2,
          position: "Managing Director of ACE Software Solutions Pvt. Ltd",
          description:
            "With over 25 years' experience in Materials Management & System Design and Finance, he is also the Founder & CEO of ASSPL, who leads the day-to-day functions on a strategic level with his domain expertise.",
        },
        {
          name: "R Abilash  Chakaravarth",
          img: Pic3,
          position: "Board of Directors of ACE Software Solutions Pvt. Ltd",
          description:
            "With over 25 years' experience in Materials Management & System Design and Finance, he is also the Founder & CEO of ASSPL, who leads the day-to-day functions on a strategic level with his domain expertise.",
        },
        {
          name: "R Abishek Karthik",
          img: Pic4,
          position: "Board of Directors of ACE Software Solutions Pvt. Ltd",
          description:
            "A Young Mechanical Engineering Graduate from Anna University and MBA in BITS Pilani with 5 years of experience in manufacturing sector provides functional and domain expertise on new product developments.",
        },
        {
          name: "S Anandh",
          img: Pic5,
          position: "Technical Head of ACE Software Solutions Pvt. Ltd",
          description:
          "With 20+ years of expertise, the lead architect designs scalable and secure ERP systems for ACE Profit, optimizing processes, enhancing efficiency, and driving business growth.",
        },
      ].map((leader, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105 md:my-10"
        >
          <div className="flex flex-col items-center p-5">
            <div className="w-32 h-32 rounded-full overflow-hidden  shadow-lg shadow-gray-300 ">
              {leader.img ? (
                <Image
                  src={leader.img}
                  alt={leader.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-center"
                />
              ) : (
                <FaUserTie className="w-20 h-20 text-gray-500 mt-5 justify-center mx-auto" />
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{leader.name}</h3>
            <p className="text-sm text-gray-600 mt-1 text-center">{leader.position}</p>
          </div>
          <div className="px-4 pb-5 text-[13px] text-gray-700  leading-relaxed text-justify  ">
            {leader.description}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
  );
};

export default AboutPage1;