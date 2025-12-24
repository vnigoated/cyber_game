'use client';

import React from 'react';
import { STRINGS } from '@/lib/strings';
import { ShieldCheck } from 'lucide-react';
import signatureImg from './assets/signature.jpg';

interface CertificateProps {
  username: string;
  certificationTitle: string;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({ username, certificationTitle, date }) => {
  return (
    <div
      style={{
        width: '800px',
        height: '600px',
        fontFamily: '"Times New Roman", serif',
      }}
      className="bg-white text-black flex relative overflow-hidden shadow-2xl"
    >
      {/* Decorative Border */}
      <div className="absolute inset-4 border border-[#e0e0e0] pointer-events-none" />
      <div className="absolute inset-2 border-4 border-[#f0f0f0] pointer-events-none" />

      {/* Main Content (Left Side) */}
      <div className="flex-1 p-12 flex flex-col justify-between relative z-10">

        {/* Header Logo */}
        <div className="flex items-center gap-4">
          <div className="bg-[#00274c] text-white px-4 py-3 font-sans font-bold text-xl tracking-widest uppercase">
            SOVAP
          </div>
        </div>

        {/* Content */}
        <div className="mt-12">
          <p className="font-sans text-sm text-gray-500 mb-2">{date}</p>
          <h2 className="text-4xl font-serif mb-6 uppercase tracking-wide">{username}</h2>
          <p className="text-gray-600 italic mb-4">has successfully completed</p>
          <h3 className="text-2xl font-bold font-sans mb-8 leading-tight">
            {STRINGS.appSubtitle} <br /> ({certificationTitle})
          </h3>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            an online non-credit course authorized by SOVAP and offered through the Cyber Defense Initiative.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8">
          <div className="w-48 h-12 relative mb-2">
            {/* VAP Signature */}
            <img
              src={signatureImg.src}
              alt="VAP Signature"
              className="w-full h-full object-contain -ml-4"
            />
          </div>
          <div className="border-t border-gray-300 w-64 pt-2">
            <p className="font-sans font-bold text-xs uppercase text-gray-600">VAP</p>
            <p className="font-sans text-[10px] text-gray-500">Chief Security Officer, SOVAP Defense</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/3 bg-[#f3f4f6] relative flex flex-col items-center pt-24 border-l border-gray-100">
        <div className="text-center mb-12">
          <h4 className="font-sans font-bold text-gray-700 tracking-[0.2em] text-sm uppercase">Course</h4>
          <h4 className="font-sans font-light text-gray-600 tracking-[0.2em] text-sm uppercase">Certificate</h4>
        </div>

        {/* The Seal */}
        <div className="relative w-40 h-40">
          {/* Seal Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-300 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-gray-400" />

          {/* Seal Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-sans font-black text-2xl text-[#00274c] tracking-tighter">SOVAP</div>
              <div className="text-[9px] uppercase tracking-widest text-[#00274c] mt-1">Cyber Certified</div>
            </div>
          </div>

          {/* Circular Text (Simulated with simple rings for now as true SVG curve text is complex in raw react without helper) */}
          <div className="absolute inset-0 rounded-full border-[10px] border-gray-100 opacity-50" />
        </div>

        {/* Bottom Verification Text */}
        <div className="absolute bottom-8 px-6 text-center">
          <p className="text-[8px] text-gray-400 font-sans">
            Verify at sovap.security/verify/{Math.random().toString(36).substring(7).toUpperCase()}
            <br />
            SOVAP has confirmed the identity of this individual and their participation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
