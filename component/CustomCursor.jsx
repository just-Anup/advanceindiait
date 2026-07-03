"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, {
    stiffness: 400,
    damping: 30,
  });

  const ringY = useSpring(mouseY, {
    stiffness: 400,
    damping: 30,
  });

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    const selectors =
      "a,button,input,textarea,select,[role='button'],.cursor-hover";

    const elements = document.querySelectorAll(selectors);

    const onEnter = () => setHover(true);
    const onLeave = () => setHover(false);

    elements.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);

      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Ring */}
      <motion.div
        animate={{
          width: hover ? 60 : 36,
          height: hover ? 60 : 36,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full border border-cyan-400"
      />

      {/* Glow */}
      <motion.div
        animate={{
          width: hover ? 18 : 10,
          height: hover ? 18 : 10,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.15,
        }}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full bg-cyan-400"
      />

      {/* Neon Shadow */}
      <motion.div
        animate={{
          width: hover ? 90 : 50,
          height: hover ? 90 : 50,
          opacity: hover ? 0.35 : 0.18,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(18px)",
        }}
        className="fixed top-0 left-0 z-[99998] pointer-events-none rounded-full bg-cyan-400"
      />
    </>
  );
}