import React, { useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxFeatureProps {
  title: string;
  subtitle: string;
  description: string;
  reverse?: boolean;
  numberTag: string;
}

const ParallaxFeature: React.FC<ParallaxFeatureProps> = ({
  title,
  subtitle,
  description,
  reverse = false,
  numberTag,
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        py: { xs: 10, md: 15 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: reverse ? "row-reverse" : "row",
            },
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* --- TEXT SECTION --- */}
          <motion.div style={{ flex: 1, y: textY }}>
            {/* Massive Watermark Number */}
            <Typography
              sx={{
                fontSize: "5rem",
                fontWeight: 900,
                color: "rgba(255,255,255,0.05)",
                lineHeight: 0.8,
                mb: -2,
                ml: -1,
              }}
            >
              {numberTag}
            </Typography>

            <Typography
              sx={{
                color: "#97bb52",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              {subtitle}
            </Typography>

            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: 800, mb: 3 }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
              }}
            >
              {description}
            </Typography>
          </motion.div>

          {/* --- VISUAL SECTION --- */}
          <motion.div
            style={{
              flex: 1,
              y: imageY,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* The Colorful Placeholder Box */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
                borderRadius: "24px",
                backgroundImage: 'url("/colorful.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                position: "relative",
                // The dark overlay leaving just a vibrant edge
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: "4px",
                  backgroundColor: "#161B07",
                  borderRadius: "20px",
                  opacity: 0.85,
                },
              }}
            ></Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ParallaxFeature;
