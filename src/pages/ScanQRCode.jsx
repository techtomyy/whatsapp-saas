import React from "react";
import whatsapp from "../assets/whatsapp.png";
import Footer from "../components/Footer";
import { RefreshCw } from 'lucide-react';

const ConnectWhatsapp = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f9fbfd] flex flex-col justify-center items-center px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <img src={whatsapp} alt="WhatsApp Logo" className="w-10 h-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-center text-black">
            <span>WhatsApp Business Management Platform</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Connect your WhatsApp to get started
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-md">
          <h2 className="text-center font-semibold text-lg mb-2">
            Scan QR Code
          </h2>
          <p className="text-center text-gray-500 mb-4 text-sm">
            Open WhatsApp on your phone and scan this QR code to connect your
            account
          </p>

          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 w-40 h-40 flex items-center justify-center rounded">
              <img
                src="/qr-placeholder.png" // replace with actual QR code source
                alt="QR Code"
                className="w-36 h-36"
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Refresh The QR Code
            </button>
          </div>

          <div className="bg-[#f1f5f9] rounded-md p-4 text-sm">
            <p className="font-medium mb-2">How to scan:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  1
                </span>
                Open WhatsApp on your phone
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  2
                </span>
                Tap Menu (⋮) and select "Linked Devices"
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  3
                </span>
                Tap "Link a Device" and scan this QR code
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default ConnectWhatsapp;
