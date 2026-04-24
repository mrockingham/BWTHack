import React, { useRef } from "react";
import { Box } from "@mui/material";
import { motion, useScroll } from "framer-motion";

const ScrollVines = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: 0.6,
      }}
    >
      {/* --- LEFT VINE SYSTEM --- */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: "-30px", md: "20px" },
          top: 0,
          bottom: 0,
          width: "120px",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          {/* Main Thick Root */}
          <motion.path
            d="M 50 0 C 90 20, 10 40, 50 60 C 90 80, 10 100, 50 100"
            stroke="#97bb52" // Your theme green
            strokeWidth="4"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scrollYProgress }}
          />
          {/* Secondary Weaving Root */}
          <motion.path
            d="M 50 0 C 10 15, 80 35, 40 55 C 0 75, 70 90, 50 100"
            stroke="#6c8c34"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      </Box>

      {/* --- RIGHT VINE SYSTEM --- */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: "-30px", md: "20px" },
          top: 0,
          bottom: 0,
          width: "120px",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 50 0 C 10 20, 90 40, 50 60 C 10 80, 90 100, 50 100"
            stroke="#97bb52"
            strokeWidth="4"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scrollYProgress }}
          />
          <motion.path
            d="M 50 0 C 90 15, 20 35, 60 55 C 100 75, 30 90, 50 100"
            stroke="#6c8c34"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      </Box>
    </Box>
  );
};

export default ScrollVines;
