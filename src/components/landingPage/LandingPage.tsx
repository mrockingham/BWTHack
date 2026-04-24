import React, { useState } from "react";
import TreeGradiantBackground from "./TreeGradiantBackground";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import FloatingPictures from "./FloatingPictures";

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const popAnimation = (delay: number) => ({
    initial: { opacity: 0, scale: 0.3, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: {
      delay: delay,
      type: "spring" as const,
      bounce: 0.5,
      duration: 0.8,
    },
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const getDynamicRotation = (baseRotation: string) => {
    const tiltX = -mousePos.y * 35;
    const tiltY = mousePos.x * 35;

    return `${baseRotation} rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  return (
    <Box onMouseMove={handleMouseMove} sx={{ width: "100%" }}>
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div {...popAnimation(4.8)}>
          <Typography
            sx={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: "1px",
              mb: 1,
            }}
          >
            Your Living Archive
          </Typography>
        </motion.div>

        <motion.div {...popAnimation(5)}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              color: "#97bb52",
              textAlign: "center",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Preserved & Powered by AI
          </Typography>
        </motion.div>
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          {/* --- LEFT SIDE PHOTOS --- */}
          <Box>
            <motion.div {...popAnimation(2.5)}>
              <FloatingPictures
                left="215px"
                top="-20px"
                rotation={getDynamicRotation("rotate(-5deg)")}
              />
            </motion.div>

            <motion.div {...popAnimation(3)}>
              <FloatingPictures
                left="85px"
                top="30px"
                rotation={getDynamicRotation("rotateY(40deg)")}
              />
            </motion.div>
          </Box>

          <TreeGradiantBackground />

          <Box></Box>

          <Box>
            <motion.div {...popAnimation(3.5)}>
              <FloatingPictures
                left="-80px"
                top="130px"
                rotation={getDynamicRotation("rotateY(-40deg)")}
              />
            </motion.div>

            <motion.div {...popAnimation(3.75)}>
              <FloatingPictures
                left="-215px"
                top="180px"
                rotation={getDynamicRotation("rotate(5deg)")}
              />
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
