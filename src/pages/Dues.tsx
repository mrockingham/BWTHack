import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

const Dues = () => {
  const [rsvpPhase, setRsvpPhase] = useState<"form" | "processing" | "success">(
    "form",
  );
  const [shirtSize, setShirtSize] = useState("L");

  // Hardcoded for demo, but normally this would come from your auth context
  const currentUser = "Michael Rockingham III";

  const handlePayment = () => {
    setRsvpPhase("processing");
    // Simulate a 2.5 second network request to Stripe/Apple Pay
    setTimeout(() => {
      setRsvpPhase("success");
    }, 2500);
  };

  const handleReset = () => {
    setRsvpPhase("form");
    setShirtSize("L");
  };

  return (
    <Box
      sx={{
        // Matches the beautiful gradient from your main canvas
        background:
          "linear-gradient(135deg, #36656B 0%, #75B06F 50%, #DAD887 100%)",
        padding: 3,
      }}
    >
      <Box sx={{ position: "sticky", top: 0, zIndex: 1200 }}>
        <ResponsiveAppBar />
      </Box>

      <Box
        sx={{
          minHeight: "100vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header Area */}
            <Box
              sx={{
                backgroundColor: "#F9F6F0",
                p: 4,
                textAlign: "center",
                borderBottom: "1px solid rgba(117, 176, 111, 0.2)",
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#36656B", fontWeight: 900, mb: 1 }}
              >
                Legacy Hub Checkout
              </Typography>
              <Typography sx={{ color: "#7f8c8d", fontWeight: "bold" }}>
                Secure RSVP & Dues Payment
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* VIEW 1: THE CHECKOUT FORM */}
              {rsvpPhase === "form" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Box
                    sx={{
                      backgroundColor: "#F9F6F0",
                      p: 3,
                      borderRadius: "12px",
                      border: "1px solid rgba(117, 176, 111, 0.3)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#7f8c8d", mb: 2, letterSpacing: "1px" }}
                    >
                      ORDER SUMMARY
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", color: "#2C3E50" }}>
                        Family Dues (2026)
                      </Typography>
                      <Typography sx={{ color: "#2C3E50" }}>$50.00</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", color: "#2C3E50" }}>
                        Commemorative T-Shirt
                      </Typography>
                      <Select
                        size="small"
                        value={shirtSize}
                        onChange={(e) => setShirtSize(e.target.value)}
                        sx={{
                          height: "36px",
                          color: "#36656B",
                          fontWeight: "bold",
                          backgroundColor: "#ffffff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#75B06F",
                          },
                        }}
                      >
                        <MenuItem value="S">Small</MenuItem>
                        <MenuItem value="M">Medium</MenuItem>
                        <MenuItem value="L">Large</MenuItem>
                        <MenuItem value="XL">X-Large</MenuItem>
                        <MenuItem value="XXL">XX-Large</MenuItem>
                      </Select>
                    </Box>
                    <Typography
                      sx={{ textAlign: "right", mt: 1, color: "#2C3E50" }}
                    >
                      $20.00
                    </Typography>

                    <Divider
                      sx={{ my: 2, borderColor: "rgba(117, 176, 111, 0.2)" }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: "#36656B", fontWeight: 900 }}
                      >
                        TOTAL
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#36656B", fontWeight: 900 }}
                      >
                        $70.00
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlePayment}
                    sx={{
                      backgroundColor: "#000000",
                      color: "white",
                      py: 2,
                      borderRadius: "12px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#333333" },
                    }}
                  >
                    Pay with Apple Pay
                  </Button>

                  <Button
                    fullWidth
                    href="/" // Routes back to the home page
                    sx={{ color: "#7f8c8d", fontWeight: "bold" }}
                  >
                    Cancel & Return Home
                  </Button>
                </Box>
              )}

              {/* VIEW 2: PROCESSING STATE */}
              {rsvpPhase === "processing" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 8,
                  }}
                >
                  <CircularProgress
                    size={60}
                    sx={{ color: "#75B06F", mb: 4, thickness: 4 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#36656B",
                      fontWeight: "bold",
                      animation: "pulse 1.5s infinite",
                    }}
                  >
                    Processing secure payment...
                  </Typography>
                  <Typography sx={{ color: "#7f8c8d", mt: 1 }}>
                    Please do not close this window.
                  </Typography>
                </Box>
              )}

              {/* VIEW 3: SUCCESS & QR CODE */}
              {rsvpPhase === "success" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "#75B06F", fontWeight: 900, mb: 2 }}
                  >
                    Payment Complete!
                  </Typography>
                  <Typography
                    sx={{ color: "#2C3E50", mb: 4, fontSize: "1.1rem", px: 2 }}
                  >
                    Your dues are paid and your{" "}
                    <strong>Size {shirtSize}</strong> shirt is reserved. Show
                    this QR code at the welcome desk for instant check-in.
                  </Typography>

                  {/* Live QR Code Generation using an open API */}
                  <Box
                    component="img"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LegacyHub-${currentUser.replace(/\s+/g, "")}-Size${shirtSize}`}
                    alt="Check-in QR Code"
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: "12px",
                      border: "6px solid #36656B",
                      padding: "10px",
                      backgroundColor: "white",
                      mb: 4,
                      boxShadow: "0 8px 24px rgba(54, 101, 107, 0.2)",
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => alert("Added to Apple Wallet! (Demo Mode)")}
                    sx={{
                      backgroundColor: "#36656B",
                      color: "white",
                      py: 1.5,
                      borderRadius: "8px",
                      fontWeight: "bold",
                      mb: 2,
                      "&:hover": { backgroundColor: "#2b5156" },
                    }}
                  >
                    Save to Apple Wallet
                  </Button>

                  <Button
                    fullWidth
                    onClick={handleReset}
                    sx={{ color: "#7f8c8d", fontWeight: "bold" }}
                  >
                    Process Another Family Member
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dues;
