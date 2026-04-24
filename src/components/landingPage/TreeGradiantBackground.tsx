import { Box } from "@mui/material";

const TreeGradiantBackground = () => {
  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        borderRadius: "50%",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "350px",
        height: "350px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <img
          height="200px"
          width="200px"
          src="/SummerTree.png"
          alt="Summer Tree"
        />
      </Box>
    </Box>
  );
};

export default TreeGradiantBackground;
