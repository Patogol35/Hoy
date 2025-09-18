import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Chip,
  Divider,
  Dialog,
  IconButton,
} from "@mui/material";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";

export default function ProductoDetalle() {
  const { state } = useLocation();
  const producto = state?.producto;
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const handleAdd = async () => {
    try {
      await agregarAlCarrito(producto.id, 1);
      toast.success(`"${producto.nombre}" agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const imagenes = producto.imagenes || [producto.imagen];

  const handleZoom = (img) => {
    setZoomImage(img);
    setZoomOpen(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      {/* Botón volver */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 3, borderRadius: 2 }}
        onClick={() => navigate(-1)}
      >
        Regresar a productos
      </Button>

      <Grid container spacing={5} alignItems="stretch">
        {/* Carrusel de imágenes */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "#fafafa",
              borderRadius: 3,
              p: 2,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Slider {...settings}>
              {imagenes.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: 300, md: 500 },
                    cursor: "pointer",
                  }}
                  onClick={() => handleZoom(img)}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`${producto.nombre} ${i + 1}`}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 2,
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Grid>

        {/* Detalles */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight="bold">
              {producto.nombre}
            </Typography>

            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 1 }}
              >
                ${producto.precio}
              </Typography>
              <Chip
                label="En stock"
                color="success"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Divider />

            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              {producto.descripcion}
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAdd}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              Agregar al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Zoom modal */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: { background: "transparent", boxShadow: "none", p: 0 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.8)",
            p: 2,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={zoomImage}
            alt={producto.nombre}
            sx={{ maxHeight: "80vh", maxWidth: "100%", objectFit: "contain" }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
