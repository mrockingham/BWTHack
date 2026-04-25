import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
  Collapse,
  IconButton,
  TextField,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ForumIcon from "@mui/icons-material/Forum";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

// Pre-seeded with a mock plan so the judges have something to look at immediately
const initialPlans = [
  {
    id: "plan-1",
    title: "2026 East Coast Convoy (Washington D.C.)",
    date: "Generated: April 25, 2026",
    content: `>>> INITIATING REUNION HEURISTICS...

Based on the Rockingham Family Archives:
- Central Location: Washington D.C. (Equidistant for Richmond, Philly, and NYC branches)
- Day 1: Convoy arrival & meet-up at the D.C. Auto Show (Mustang Exhibit). 
- Day 2: ADA-accessible tour of the National Museum of African American History and Culture. 
- Day 3: Farewell BBQ at Rock Creek Park (Stroller-friendly for Baby Michael).

Lodging: The Mayflower Hotel (Wheelchair accessible elevators confirmed).`,
  },
];

const initialComments: Record<string, { user: string; text: string }[]> = {
  "plan-1": [
    {
      user: "Marcus Rockingham",
      text: "I call dibs on the grill for Day 3! 🥩",
    },
    {
      user: "Elena Barbosa",
      text: "Love the museum idea. Is there a vegan option near the hotel for Day 1?",
    },
  ],
};

const Planner = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [expandedId, setExpandedId] = useState<string | null>("plan-1");
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const currentUser = "Michael Rockingham III"; // Mock auth user

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI update
    setPlans(plans.filter((p) => p.id !== id));

    // Delete from DB
    try {
      await fetch(`https://bwthackbe.onrender.com/api/plans/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete plan");
    }
  };

  const handlePostComment = (planId: string) => {
    if (!newComment.trim()) return;

    const commentObj = { user: currentUser, text: newComment };
    setComments((prev) => ({
      ...prev,
      [planId]: [...(prev[planId] || []), commentObj],
    }));
    setNewComment("");
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          "https://bwthackbe.onrender.com/api/plans",
        );
        const data = await response.json();

        // Format the DB data to match the UI
        const formattedPlans = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          date: new Date(p.created_at).toLocaleDateString(),
          content: p.content,
        }));

        setPlans(formattedPlans);
        if (formattedPlans.length > 0) setExpandedId(formattedPlans[0].id);
      } catch (error) {
        console.error("Failed to load plans", error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #36656B 0%, #75B06F 50%, #DAD887 100%)",
        // Buffer for the navigation bar
        paddingBottom: 10,
      }}
    >
      <Box sx={{ position: "sticky", top: 0, zIndex: 1200 }}>
        <ResponsiveAppBar />
      </Box>

      <Box>
        <Container maxWidth="md">
          {/* Page Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 900,
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Family Plans
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.1rem",
                  mt: 1,
                }}
              >
                Review AI proposals and discuss logistics.
              </Typography>
            </Box>
            <Button
              href="/"
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "rgba(0,0,0,0.2)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" },
              }}
            >
              ← Back to Map
            </Button>
          </Box>

          {plans.length === 0 ? (
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography variant="h6" sx={{ color: "#7f8c8d" }}>
                No plans saved yet.
              </Typography>
              <Typography sx={{ color: "#7f8c8d", mb: 3 }}>
                Go to the Interactive Tree to generate an AI Reunion Plan.
              </Typography>
              <Button
                href="/tree"
                variant="contained"
                sx={{ backgroundColor: "#36656B" }}
              >
                Open Tree
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {plans.map((plan) => {
                const isExpanded = expandedId === plan.id;

                return (
                  <Paper
                    key={plan.id}
                    elevation={isExpanded ? 8 : 2}
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Accordion Header */}
                    <Box
                      onClick={() => toggleExpand(plan.id)}
                      sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: isExpanded ? "#ffffff" : "#F9F6F0",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#ffffff" },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{ color: "#36656B", fontWeight: 800 }}
                        >
                          {plan.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#7f8c8d", fontWeight: "bold" }}
                        >
                          {plan.date}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          onClick={(e) => handleDelete(plan.id, e)}
                          sx={{ color: "#e74c3c" }}
                          size="small"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                        {isExpanded ? (
                          <ExpandLessIcon sx={{ color: "#36656B" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: "#36656B" }} />
                        )}
                      </Box>
                    </Box>

                    {/* Accordion Body */}
                    <Collapse in={isExpanded}>
                      <Box sx={{ p: 3, backgroundColor: "#ffffff" }}>
                        {/* Plan Content */}
                        <Box
                          sx={{
                            backgroundColor: "#F9F6F0",
                            p: 3,
                            borderRadius: "8px",
                            border: "1px solid rgba(117, 176, 111, 0.3)",
                            color: "#2C3E50",
                            lineHeight: 1.6,
                            // Magic CSS to style the Markdown elements automatically
                            "& h1, & h2, & h3": {
                              color: "#36656B",
                              mt: 0,
                              mb: 1,
                              fontWeight: 800,
                            },
                            "& p": { mb: 2, fontSize: "1rem" },
                            "& ul, & ol": { paddingLeft: 3, mb: 2 },
                            "& li": { mb: 0.5 },
                            "& strong": { color: "#36656B" },
                            "& table": {
                              width: "100%",
                              borderCollapse: "collapse",
                              mb: 2,
                              fontSize: "0.9rem",
                            },
                            "& th, & td": {
                              border: "1px solid #75B06F",
                              padding: "8px",
                              textAlign: "left",
                            },
                            "& th": {
                              backgroundColor: "rgba(117, 176, 111, 0.1)",
                              color: "#36656B",
                            },
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {plan.content}
                          </ReactMarkdown>
                        </Box>

                        <Divider sx={{ my: 4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: "#75B06F",
                            }}
                          >
                            <ForumIcon fontSize="small" />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              FAMILY DISCUSSION
                            </Typography>
                          </Box>
                        </Divider>

                        {/* Discussion Board */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mb: 3,
                          }}
                        >
                          {(comments[plan.id] || []).map((comment, idx) => (
                            <Box key={idx} sx={{ display: "flex", gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#75B06F",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {comment.user.charAt(0)}
                              </Avatar>
                              <Box
                                sx={{
                                  backgroundColor: "#F9F6F0",
                                  p: 2,
                                  borderRadius: "0px 12px 12px 12px",
                                  flexGrow: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#36656B",
                                    display: "block",
                                    mb: 0.5,
                                  }}
                                >
                                  {comment.user}
                                </Typography>
                                <Typography
                                  sx={{ color: "#2C3E50", fontSize: "0.95rem" }}
                                >
                                  {comment.text}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        {/* New Comment Input */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#36656B",
                              fontSize: "0.9rem",
                            }}
                          >
                            {currentUser.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Add your thoughts to the itinerary..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handlePostComment(plan.id)
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "20px",
                                },
                              }}
                            />
                            <Button
                              variant="contained"
                              onClick={() => handlePostComment(plan.id)}
                              disabled={!newComment.trim()}
                              sx={{
                                backgroundColor: "#36656B",
                                color: "white",
                                borderRadius: "20px",
                                px: 3,
                                "&:hover": { backgroundColor: "#2b5156" },
                              }}
                            >
                              Post
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Collapse>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Planner;
