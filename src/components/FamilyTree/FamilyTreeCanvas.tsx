import { useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
} from "@xyflow/react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { AddRelativeModal } from "./AddRelativeModal";
import { initialNodes, initialEdges } from "./mockFamilyData";
import "@xyflow/react/dist/style.css";
import ResponsiveAppBar from "../ResponsiveAppBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CustomProfileNode from "./CustomProfileNode";

const nodeTypes = {
  customProfile: CustomProfileNode,
};

const techMessages = [
  "SCANNING ARCHIVES...",
  "RETRIEVING GENERATIONAL DATA...",
  "SYNCHRONIZING RECORDS...",
  "FORMATTING HISTORY...",
];

const FamilyTreeCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [archives, setArchives] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [reunionPlan, setReunionPlan] = useState("");
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    Record<string, { role: "user" | "ai"; text: string }[]>
  >({});
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingText, setLoadingText] = useState(techMessages[0]);

  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  const [isOralHistoryOpen, setIsOralHistoryOpen] = useState(false);
  const [recordingPhase, setRecordingPhase] = useState<
    "idle" | "recording" | "transcribing" | "done"
  >("idle");
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTyping) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % techMessages.length;
        setLoadingText(techMessages[i]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  // Load Data
  useEffect(() => {
    const loadFamilyData = async () => {
      try {
        const response = await fetch(
          "https://bwthackbe.onrender.com/api/family",
        );
        const dbData = await response.json();
        if (dbData && dbData.length > 0) {
          const dbNodes = dbData.map((p: any) => ({
            id: p.node_id,
            position: { x: p.position_x, y: p.position_y },
            type: "customProfile", // <-- Tell ReactFlow to use our new card
            data: {
              label: p.name,
              dob: p.dob, // <-- Pass the DOB (will default to n/a if null)
            },
            style: {
              background: "#ffffff",
              color: "#2C3E50",
              border: "2px solid #75B06F",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.59)", // Stronger shadow to lift it off the page
              fontWeight: "bold",
              fontSize: "14px",
            },
          }));

          const dbEdges = dbData
            .filter((p: any) => p.connected_to_id)
            .map((p: any) => ({
              id: `e${p.connected_to_id}-${p.node_id}`,
              source: p.connected_to_id,
              target: p.node_id,
              animated: true,
              style: { stroke: "#ffffff", strokeWidth: 3 }, // White lines pop against the gradient
            }));

          const dbArchives: Record<string, string> = {};
          dbData.forEach((p: any) => {
            dbArchives[p.name] = `
              Full Profile for ${p.name}:
              Biography: ${p.bio}
              Current Location: ${p.location}
              Interests & Hobbies: ${p.interests}
              Special Requirements: ${p.special_requirements}
            `.trim();
          });

          const formattedInitial = initialNodes.map((node) => ({
            ...node,
            type: "customProfile",
          }));

          setNodes([...formattedInitial, ...dbNodes]);

          setNodes([...initialNodes, ...dbNodes]);
          setEdges([...initialEdges, ...dbEdges]);
          setArchives(dbArchives);
        }
      } catch (e) {
        console.error("Data load failed, check backend:", e);
      }
    };
    loadFamilyData();
  }, [setNodes, setEdges]);

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  };

  const handleAddPerson = async (formData: any) => {
    const newId = Date.now().toString();
    const parentNode = nodes.find((n) => n.id === formData.connectedToId);
    const posX = parentNode ? parentNode.position.x : 250;
    const posY = parentNode ? parentNode.position.y + 150 : 250;

    const newNode: Node = {
      id: newId,
      position: { x: posX, y: posY },
      type: "customProfile",
      data: { label: formData.name },
      style: {
        background: "#ffffff",
        color: "#2C3E50",
        border: "2px solid #75B06F",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        fontWeight: "bold",
      },
    };

    const newEdge = {
      id: `e${formData.connectedToId}-${newId}`,
      source: formData.connectedToId,
      target: newId,
      animated: true,
      style: { stroke: "#ffffff", strokeWidth: 3 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);

    try {
      await fetch("https://bwthackbe.onrender.com/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: newId,
          ...formData,
          positionX: posX,
          positionY: posY,
        }),
      });
    } catch (error) {
      console.error("Save failed:", error);
    }
    setIsAddModalOpen(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedNode) return;

    const personName = selectedNode.data.label as string;
    const userMessage = chatInput;

    const newUserMsg = { role: "user" as const, text: userMessage };
    setChatHistory((prev) => ({
      ...prev,
      [personName]: [...(prev[personName] || []), newUserMsg],
    }));

    setChatInput("");
    setIsTyping(true);

    try {
      const archiveData = archives[personName] || "No archive data available.";
      const response = await fetch("https://bwthackbe.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, personName, archiveData }),
      });

      const data = await response.json();

      const newAiMsg = { role: "ai" as const, text: data.reply };
      setChatHistory((prev) => ({
        ...prev,
        [personName]: [...(prev[personName] || []), newAiMsg],
      }));
    } catch (error) {
      const errorMsg = {
        role: "ai" as const,
        text: "System Error: Archive link unstable.",
      };
      setChatHistory((prev) => ({
        ...prev,
        [personName]: [...(prev[personName] || []), errorMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const generatePlan = async () => {
    setIsPlannerOpen(true);
    setIsLoadingPlan(true);
    try {
      const response = await fetch(
        "https://bwthackbe.onrender.com/api/reunion-plan",
      );
      const data = await response.json();
      setReunionPlan(data.plan);
    } catch (error) {
      setReunionPlan("Failed to generate plan. Please try again.");
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setRecordingPhase("recording");
    } catch (err) {
      console.error("Mic access denied:", err);
      alert("Please allow microphone access to record oral history.");
    }
  };

  const stopRecordingAndTranscribe = async () => {
    setRecordingPhase("transcribing");
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder) {
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(",")[1];
          try {
            const response = await fetch(
              "https://bwthackbe.onrender.com/api/transcribe",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  audioBase64: base64data,
                  mimeType: "audio/webm",
                  personName: selectedNode?.data.label || "Unknown Relative",
                }),
              },
            );
            const data = await response.json();
            setTranscript(data.transcript);
            setRecordingPhase("done");
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
          } catch (error) {
            setTranscript("Error: Archive link unstable during audio upload.");
            setRecordingPhase("done");
          }
        };
      };
      mediaRecorder.stop();
    }
  };

  return (
    // NEW BEAUTIFUL GRADIENT BACKGROUND
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #36656B 0%, #75B06F 50%, #DAD887 100%)",
      }}
    >
      <Box sx={{ position: "sticky", top: 0, zIndex: 1200 }}>
        <ResponsiveAppBar />
      </Box>

      {/* Mock Login / Perspective Switcher */}

      <Button
        variant="contained"
        onClick={() => setIsAddModalOpen(true)}
        sx={{
          position: "absolute",
          top: 100,
          left: 20,
          zIndex: 10,
          backgroundColor: "#36656B",
          color: "white",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#2b5156" },
        }}
      >
        + Add Relative
      </Button>

      <Button
        variant="contained"
        onClick={generatePlan}
        sx={{
          position: "absolute",
          top: 100,
          left: 180,
          zIndex: 10,
          backgroundColor: "#ffffff",
          color: "#36656B",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        ✨ Plan Reunion
      </Button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        colorMode="light"
      >
        <Background color="rgba(255,255,255,0.2)" gap={20} />
        <Controls />
      </ReactFlow>

      <AddRelativeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPerson}
        existingNodes={nodes}
      />

      {/* Reunion Plan Modal (Heritage Theme) */}
      <Dialog
        open={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#ffffff",
              color: "#2C3E50",
              p: 3,
              borderRadius: "12px",
            },
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#36656B", mb: 2, fontWeight: 800 }}
        >
          AI Reunion Proposal
        </Typography>
        <DialogContent>
          {isLoadingPlan ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
            >
              <CircularProgress
                sx={{ color: "#75B06F", mb: 3, thickness: 5 }}
              />
              <Typography
                sx={{
                  color: "#36656B",
                  fontFamily: "monospace",
                  textAlign: "center",
                  letterSpacing: "1px",
                  animation: "pulse 1.5s infinite",
                }}
              >
                GENERATING ITINERARY...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                color: "#2C3E50",
                backgroundColor: "#F9F6F0",
                p: 3,
                borderRadius: "8px",
                border: "1px solid rgba(117, 176, 111, 0.3)",
                lineHeight: 1.6,
                maxHeight: "60vh",
                overflowY: "auto",
                // Magic CSS to style the Markdown elements automatically!
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
                {reunionPlan}
              </ReactMarkdown>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
          <Button
            onClick={() => setIsPlannerOpen(false)}
            sx={{ color: "#7f8c8d", fontWeight: "bold" }}
          >
            Close
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={async () => {
                setIsSavingPlan(true);
                try {
                  await fetch("https://bwthackbe.onrender.com/api/plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Giving it a dynamic title based on the date
                    body: JSON.stringify({
                      title: `AI Proposal - ${new Date().toLocaleDateString()}`,
                      content: reunionPlan,
                    }),
                  });
                  setPlanSaved(true);
                  setTimeout(() => setPlanSaved(false), 3000);
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSavingPlan(false);
                }
              }}
              disabled={isSavingPlan || planSaved}
              sx={{
                borderColor: "#36656B",
                color: "#36656B",
                fontWeight: "bold",
              }}
            >
              {isSavingPlan
                ? "Saving..."
                : planSaved
                  ? "Saved!"
                  : "💾 Save to Planner"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {}}
              sx={{
                backgroundColor: "#36656B",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#2b5156" },
              }}
            >
              RSVP & Dues
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Oral History Modal (Heritage Theme) */}
      <Dialog
        open={isOralHistoryOpen}
        onClose={() => setIsOralHistoryOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#ffffff",
              color: "#2C3E50",
              p: 3,
              minWidth: "350px",
              textAlign: "center",
              borderRadius: "12px",
            },
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#36656B", mb: 3, fontWeight: "bold" }}
        >
          AI Oral History
        </Typography>

        {recordingPhase === "idle" && (
          <Button
            variant="contained"
            onClick={startRecording}
            sx={{
              backgroundColor: "#e74c3c",
              color: "white",
              borderRadius: "50px",
              height: "80px",
              width: "80px",
              mx: "auto",
              mb: 2,
              "&:hover": { backgroundColor: "#c0392b" },
            }}
          >
            🎙️
          </Button>
        )}

        {recordingPhase === "recording" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={stopRecordingAndTranscribe}
              sx={{
                height: 80,
                width: 80,
                borderRadius: "50%",
                backgroundColor: "#e74c3c",
                animation: "pulse 1s infinite",
              }}
            />
            <Typography
              sx={{
                color: "#e74c3c",
                animation: "pulse 1s infinite",
                fontWeight: "bold",
              }}
            >
              ● REC (Click to Stop)
            </Typography>
          </Box>
        )}

        {recordingPhase === "transcribing" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 3,
            }}
          >
            <CircularProgress sx={{ color: "#75B06F" }} />
            <Typography sx={{ fontFamily: "monospace", color: "#36656B" }}>
              Uploading to Legacy Hub...
            </Typography>
          </Box>
        )}

        {recordingPhase === "done" && (
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ color: "#7f8c8d", fontSize: "0.8rem", mb: 1 }}>
              Generated Transcript:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#F9F6F0",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #75B06F",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  color: "#2C3E50",
                }}
              >
                {transcript}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                if (selectedNode) {
                  const personName = selectedNode.data.label as string;
                  const nodeId = selectedNode.id;
                  const systemMsg = {
                    role: "ai" as const,
                    text: `[MEMORY SAVED]:\n"${transcript}"`,
                  };
                  setChatHistory((prev) => ({
                    ...prev,
                    [personName]: [...(prev[personName] || []), systemMsg],
                  }));
                  setIsOralHistoryOpen(false);
                  setRecordingPhase("idle");
                  try {
                    const response = await fetch(
                      `https://bwthackbe.onrender.com/api/family/${nodeId}/memory`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ transcript }),
                      },
                    );
                    if (response.ok) {
                      setArchives((prev) => ({
                        ...prev,
                        [personName]:
                          prev[personName] +
                          `\n\n[ORAL HISTORY]: ${transcript}`,
                      }));
                    }
                  } catch (error) {
                    console.error(error);
                  }
                  setTranscript("");
                }
              }}
              sx={{
                backgroundColor: "#36656B",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#2b5156" },
              }}
            >
              Save to Archives
            </Button>
          </Box>
        )}
      </Dialog>

      {/* Drawer (Heritage Theme) */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.2)" } },
          paper: {
            sx: {
              width: { xs: "100%", md: "420px" },
              backgroundColor: "#ffffff",
              color: "#2C3E50",
              p: 3,
              borderLeft: "6px solid #75B06F",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {selectedNode && (
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#36656B", mb: 0.5 }}
            >
              {selectedNode.data.label as string}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#7f8c8d", mb: 2, fontWeight: "bold" }}
            >
              VERIFIED FAMILY ARCHIVE
            </Typography>

            <Divider sx={{ backgroundColor: "rgba(0,0,0,0.1)", mb: 3 }} />

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Button
                component="label"
                size="small"
                variant="outlined"
                sx={{
                  color: "#36656B",
                  borderColor: "rgba(54, 101, 107, 0.3)",
                  fontWeight: "bold",
                }}
              >
                📷 Add Photo
                <input type="file" hidden accept="image/*" />
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => setIsOralHistoryOpen(true)}
                sx={{
                  backgroundColor: "#75B06F",
                  color: "white",
                  fontWeight: "bold",
                  flexGrow: 1,
                  "&:hover": { backgroundColor: "#5f9159" },
                }}
              >
                🎙️ Record Memory
              </Button>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
                pr: 1,
              }}
            >
              {(chatHistory[selectedNode.data.label as string] || []).map(
                (msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      alignSelf:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.role === "user" ? "#36656B" : "#F9F6F0",
                      p: 2,
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      maxWidth: "85%",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: msg.role === "user" ? "white" : "#2C3E50",
                        fontSize: "0.95rem",
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                ),
              )}
              {isTyping && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 2,
                    backgroundColor: "#F9F6F0",
                    borderRadius: "16px 16px 16px 4px",
                    alignSelf: "flex-start",
                  }}
                >
                  <CircularProgress size={16} sx={{ color: "#75B06F" }} />
                  <Typography
                    sx={{
                      color: "#7f8c8d",
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                    }}
                  >
                    {loadingText}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about this relative..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F9F6F0",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#75B06F" },
                    "&.Mui-focused fieldset": { borderColor: "#36656B" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={isTyping}
                sx={{
                  backgroundColor: "#36656B",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#2b5156" },
                }}
              >
                ASK
              </Button>
            </Box>

            <Button
              fullWidth
              onClick={() => setIsDrawerOpen(false)}
              sx={{ color: "#7f8c8d", fontSize: "0.7rem", fontWeight: "bold" }}
            >
              CLOSE ARCHIVE
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default FamilyTreeCanvas;
