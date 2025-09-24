import { Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function LightboxModal({ open, onClose, src }) {
  if (!src) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{ zIndex: 1700 }}
      PaperProps={{
        sx: {
          bgcolor: "rgba(0,0,0,0.95)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(0,0,0,0.6)",
          color: "white",
        }}
        aria-label="Cerrar lightbox"
      >
        <CloseIcon />
      </IconButton>

      <Box
        component="img"
        src={src}
        alt="Zoom"
        sx={{
          maxWidth: "95%",
          maxHeight: "95%",
          objectFit: "contain",
        }}
      />
    </Dialog>
  );
}
