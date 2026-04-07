"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, ArrowRight, Bot, Clock, Zap } from "lucide-react";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";

export default function SOWIntakePage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* Centered heading */}
      <motion.div variants={fadeUp} className="text-center mb-10">
        <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">
          How would you like to start?
        </h1>
        <p className="mt-2 text-[14px] text-gray-400">
          Choose a method to create your Statement of Work.
        </p>
      </motion.div>

      {/* Two choice cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

        {/* AI Generate — recommended */}
        <motion.div variants={scaleIn}>
          <Link href="/enterprise/sow/generate" className="block h-full">
            <div className="relative card-parchment h-full flex flex-col items-center text-center px-8 py-10 transition-all duration-200 hover:-translate-y-1 cursor-pointer">
              {/* Recommended badge */}
              <span className="absolute top-4 right-4 text-[9px] font-semibold tracking-wider uppercase text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                Recommended
              </span>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h2 className="text-[17px] font-semibold text-gray-900 mb-2">Generate with AI</h2>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
                Describe your project and our AI will craft a complete, structured SOW for you.
              </p>

              {/* Meta */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-6">
                <Clock className="w-3 h-3" /> ~15 minutes
              </div>

              {/* CTA */}
              <span className="flex items-center gap-2 text-[13px] font-medium text-white bg-gradient-to-r from-brown-400 to-brown-600 px-6 py-2.5 rounded-xl mt-auto">
                Start Wizard <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Upload existing */}
        <motion.div variants={scaleIn}>
          <Link href="/enterprise/sow/upload" className="block h-full">
            <div className="card-parchment h-full flex flex-col items-center text-center px-8 py-10 transition-all duration-200 hover:-translate-y-1 cursor-pointer">

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center mb-6">
                <Upload className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h2 className="text-[17px] font-semibold text-gray-900 mb-2">Upload Existing SOW</h2>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
                Already have a document? Upload it and we'll parse, extract, and analyze it automatically.
              </p>

              {/* Meta */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-6">
                <Clock className="w-3 h-3" /> ~5 minutes
              </div>

              {/* CTA */}
              <span className="flex items-center gap-2 text-[13px] font-medium text-brown-600 bg-brown-50 border border-brown-200 px-6 py-2.5 rounded-xl mt-auto">
                Upload Document <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Pro tip */}
      <motion.div variants={fadeUp} className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-gold-50">
        <Zap className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
        <p className="text-[12px] text-gray-600">
          <span className="font-semibold text-gray-700">Pro tip:</span> Use AI generation for new engagements. Upload when your client provides their own SOW document.
        </p>
      </motion.div>

    </motion.div>
  );
}
