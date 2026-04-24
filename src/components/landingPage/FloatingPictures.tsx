import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface FloatingPicturesProps {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  rotation?: string;
}

const FloatingPictures: React.FC<FloatingPicturesProps> = ({
  left = "0px",
  right = "0px",
  top = "0px",
  bottom = "0px",
  rotation = "rotate(0deg)",
}) => {
  return (
    <Box
      sx={{
        perspective: "1000px",
        position: "relative",
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        maxHeight: "200px",
        maxWidth: "200px",

        zIndex: "1",
      }}
    >
      <Box
        style={{
          transition: ".3s",
          transform: rotation,
          height: "100px",
        }}
      >
        <Card
          sx={{
            maxW: "100px",
            h: "100px",
          }}
        >
          <CardContent>
            <img height="25px" width="25px" src="https://i.pravatar.cc/74" />
            <Stack
              sx={{
                mt: "2",
                spacing: "0",
              }}
            >
              <Typography sx={{ fontSize: ".7rem" }}>Name...</Typography>
              <Typography sx={{ fontSize: ".5rem" }}>DOB...</Typography>
              <Typography sx={{ fontSize: ".4rem" }}>.......</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default FloatingPictures;
