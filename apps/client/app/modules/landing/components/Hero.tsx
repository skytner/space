"use client";

import { Typography } from "@packages/react-ui";
import { motion } from "framer-motion";

interface HeroProps {
  description: string;
  title: string;
}

export default function Hero({ title, description }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 m-auto h-96 w-96 bg-orange-600/20 blur-[120px] rounded-full flex flex-col items-center"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full text-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <Typography.H1 className="text-6xl md:text-8xl mb-8 bg-linear-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-tight text-center">
            {title}
          </Typography.H1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <Typography.Paragraph className="max-w-2xl mx-auto text-slate-400 text-xl mb-12 text-center">
            {description}
          </Typography.Paragraph>
        </motion.div>
      </div>
    </section>
  );
}
