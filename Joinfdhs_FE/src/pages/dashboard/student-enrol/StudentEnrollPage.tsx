import React from "react";
import { Link } from "react-router-dom";
import { SettingOutlined } from "@ant-design/icons";

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#172566] text-white overflow-hidden">
      {/* Left Brain Image */}
      <div className="absolute top-0 left-0 w-[382px] h-full">
        <img
          src="/assets/student-dashboard/studentDashboard1b.png"
          alt="Brain Image Left"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Brain Image */}
      <div className="absolute top-0 right-0 w-[382px] h-full">
        <img
          src="/assets/student-dashboard/studentDashboard1b.png"
          alt="Brain Image Right"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Settings Icon */}
      <div className="absolute top-4 right-4 text-white">
        <Link to="/student-dashboard">
          <SettingOutlined className="text-2xl cursor-pointer" />
        </Link>
      </div>

      {/* Center Main Image */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[676px] h-full">
        <img
          src="/assets/student-dashboard/studentDashboard1a.jpeg"
          alt="Main Brain Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* "ENROL NOW!" Text */}
      <h1 className="absolute text-center font-bold text-white text-[90px] leading-[108px] top-[99px] left-1/2 transform -translate-x-1/2 shadow-lg">
        ENROL NOW!
      </h1>

      {/* "fdhs.in" Text */}
      <a
        href="https://fdhs.in"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute font-extrabold text-[#F0406F] text-[128px] leading-[154px] top-1/2 left-1/2 transform -translate-x-1/2 shadow-lg"
      >
        fdhs.in
      </a>

      {/* "RSIC Academy" Text */}
      <p className="absolute text-center font-bold text-white text-[48px] leading-[58px] top-[790px] left-1/2 transform -translate-x-1/2 shadow-md">
        RSIC Academy
      </p>

      {/* "Mohali Campus" Text */}
      <p className="absolute text-center font-bold text-white text-[40px] leading-[48px] top-[856px] left-1/2 transform -translate-x-1/2 shadow-md">
        Mohali Campus
      </p>

      {/* Links Section */}
      <div className="absolute flex justify-center items-center space-x-8 bottom-0 w-full p-4 bg-[#F0406F] text-[#023173] text-[32px] font-normal leading-[38px]">
        <a
          href="https://medumass.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4"
        >
          medumass.com
        </a>
        <a
          href="https://medloom.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4"
        >
          medloom.com
        </a>
        <a
          href="https://mediksha.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4"
        >
          mediksha.com
        </a>
        <a
          href="https://cloudacademy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4"
        >
          cloudacademy.com
        </a>
        <a
          href="https://cloudatomy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4"
        >
          cloudatomy.com
        </a>
      </div>
    </div>
  );
};

export default Home;