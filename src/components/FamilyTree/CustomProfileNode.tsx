import { Handle, Position } from "@xyflow/react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

const CustomProfileNode = ({ data }: any) => {
  return (
    <Card
      sx={{
        minWidth: 160,
        background: "#ffffff",
        border: "2px solid #75B06F",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "visible", // CRITICAL: Allows the connection dots to sit outside the box
      }}
    >
      {/* Top Connection Dot */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#36656B",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />

      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <img
            src={`https://i.pravatar.cc/150?u=${data.label}`}
            style={{
              width: 50,
              height: 50,
              border: "1px solid #75B06F",
              borderRadius: "10px",
            }}
          />
          <Stack spacing={0}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#2C3E50",
                lineHeight: 1.2,
              }}
            >
              {data.label}
            </Typography>
            <Typography
              sx={{ fontSize: "0.6rem", color: "#7f8c8d", fontWeight: "bold" }}
            >
              {/* Fallback to n/a if dob is missing */}
              DOB: {data.dob || "n/a"}
            </Typography>
          </Stack>
        </Box>
      </CardContent>

      {/* Bottom Connection Dot */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#36656B",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />
    </Card>
  );
};

export default CustomProfileNode;
