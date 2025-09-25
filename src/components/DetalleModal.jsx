import { Box, Typography, Grid, Stack, Divider, Chip, Button, IconButton, Dialog } from "@mui/material";
import Slider from "react-slick";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; // 👈 cambiado
import CloseIcon from "@mui/icons-material/Close";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const botonCerrarSx = {
  position: "absolute",
  top: 12,
  right: 12,
  bgcolor: "rgba(0,0,0,0.6)",
  color: "white",
  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
};

const imagenSx = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  borderRadius: 2,
  border: "2px solid rgba(255,255,255,0.2)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  transition: "transform 0.3s ease",
  "&:hover": { transform: "scale(1.02)" },
};

export default function DetalleModal({ producto, open, onClose, onAdd, setLightbox }) {
  if (!producto) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        zIndex: 1600,
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(5px)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 3 },
          p: 3,
          bgcolor: "#1e1e1e",
          color: "white",
          width: "100%",
          maxWidth: { xs: "100%", md: 900 },
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        },
      }}
    >
      <IconButton onClick={onClose} sx={botonCerrarSx}>
        <CloseIcon />
      </IconButton>

      <Grid container spacing={4}>
        {/* Slider de imágenes */}
        <Grid item xs={12} md={6}>
          {(producto.imagenes || [producto.imagen]).length > 1 ? (
            <Slider {...sliderSettings}>
              {(producto.imagenes || [producto.imagen]).map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: 300, md: 400 },
                    cursor: "zoom-in",
                  }}
                  onClick={() => setLightbox(img)}
                >
                  <Box component="img" src={img} alt={producto.nombre} loading="lazy" sx={imagenSx} />
                </Box>
              ))}
            </Slider>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 300, md: 400 },
              }}
              onClick={() => setLightbox(producto.imagen)}
            >
              <Box component="img" src={producto.imagen} alt={producto.nombre} loading="lazy" sx={imagenSx} />
            </Box>
          )}
        </Grid>

        {/* Información */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold">
              {producto.nombre}
            </Typography>

            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                ${producto.precio}
              </Typography>

              <Chip
                label={producto.stock > 0 ? "En stock" : "Agotado"}
                color={producto.stock > 0 ? "success" : "error"}
                variant="outlined"
                sx={{ color: "white", borderColor: "white", fontWeight: "bold" }}
              />
            </Box>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

            <Typography sx={{ lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
              {producto.descripcion}
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}  // 👈 icono cambiado
              onClick={() => onAdd(producto)}
              disabled={producto.stock === 0}
              sx={{
                borderRadius: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                "&:hover": { transform: producto.stock > 0 ? "translateY(-2px)" : "none" },
              }}
            >
              {producto.stock > 0 ? "Agregar al carrito" : "Agotado"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Dialog>
  );
}
