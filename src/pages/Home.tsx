import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import MainPage from "../components/landingPage/LandingPage";

const Home = () => {
  const [showText, setShowText] = useState(true);
  const [showInk, setShowInk] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [shrinkBackground, setShrinkBackground] = useState(false);
  const [showScrollTip, setShowScrollTip] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(false), 3600);
    const inkTimer = setTimeout(() => setShowInk(true), 3300);
    const treeTimer = setTimeout(() => setShowTree(true), 4800);
    // 4. Trigger the circle shrink
    const shrinkTimer = setTimeout(() => setShrinkBackground(true), 6500);
    const scrollTimer = setTimeout(() => setShowScrollTip(true), 8000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(inkTimer);
      clearTimeout(treeTimer);
      clearTimeout(shrinkTimer);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",

          minHeight: "100vh",
          overflowX: "hidden",

          backgroundColor: !showTree ? "black" : "#2e413b",
          transition: "background-color 1.5s ease",
        }}
        className={`banner ${showInk ? "ink-active" : ""} ${shrinkBackground ? "shrink-active" : ""}`}
      >
        {/* LAYER 1: The Intro Text */}

        <AnimatePresence>
          {showText && (
            <motion.div
              className="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 1.2 }}
              style={{ position: "absolute", zIndex: 10 }}
            >
              <Box
                sx={{
                  height: "100vh",
                  width: "100vw",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "4rem",
                    textAlign: "center",
                    fontWeight: 900,
                    backgroundImage: 'url("/colorful.jpg")',
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "2px 2px 40px rgba(255,255,255,0.5)",
                    lineHeight: 1.2,
                  }}
                >
                  The Legacy Hub
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    fontWeight: 400,
                    color: "white",
                    mt: 1,
                    letterSpacing: "2px",
                    opacity: 0.9,
                  }}
                >
                  Unifying Generations. Preserving History.
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LAYER 2: The Tree Reveal */}

        <AnimatePresence>
          {showTree && (
            <motion.div
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: [0.25, 0.8, 0.25, 1] }}
              style={{ position: "absolute", zIndex: 5 }}
            >
              <Box
                sx={{
                  height: "100vh",
                  width: "100vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MainPage />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        {/* LAYER 3: The Scroll Indicator */}
        <AnimatePresence>
          {showScrollTip && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              style={{
                position: "absolute",
                bottom: "30px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                zIndex: 20,
              }}
            >
              {/* This inner motion.div handles the infinite bounce */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    opacity: 0.7,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    marginTop: 40,
                  }}
                >
                  Scroll to Explore
                  <span style={{ fontSize: "1.5rem" }}>↓</span>
                </Typography>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default Home;
