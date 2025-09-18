import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const products = [
    {
      id: 1,
      name: "Producto 1",
      description: "Descripción corta del producto 1",
      price: "$20",
      images: [
        "https://picsum.photos/800/600?random=1",
        "https://picsum.photos/800/600?random=2",
        "https://picsum.photos/800/600?random=3",
      ],
    },
    {
      id: 2,
      name: "Producto 2",
      description: "Descripción corta del producto 2",
      price: "$35",
      images: [
        "https://picsum.photos/800/600?random=4",
        "https://picsum.photos/800/600?random=5",
        "https://picsum.photos/800/600?random=6",
      ],
    },
  ];

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Productos
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={4} key={product.id}>
            <Card
              onClick={() => handleOpen(product)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images[0]}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="subtitle1">{product.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de producto */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        sx={{
          zIndex: 1600, // 🔹 asegura que tape todo
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
            maxWidth: { md: 900 },
            width: "100%",
            position: "relative",
          },
        }}
      >
        {selectedProduct && (
          <Box>
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Grid container spacing={3}>
              {/* Carrusel */}
              <Grid item xs={12} md={7}>
                <Slider {...settings}>
                  {selectedProduct.images.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: { xs: 250, md: 400 },
                        cursor: "zoom-in",
                      }}
                      onClick={() => setLightbox(img)}
                    >
                      <img
                        src={img}
                        alt={`slide-${index}`}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
              </Grid>

              {/* Detalles */}
              <Grid item xs={12} md={5}>
                <Typography variant="h5" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedProduct.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.price}
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Añadir al carrito
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Dialog>

      {/* Lightbox de zoom */}
      <Dialog
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        fullScreen
        sx={{ zIndex: 1600 }} // 🔹 también encima de todo
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
          onClick={() => setLightbox(null)}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "white",
          }}
        >
          <CloseIcon sx={{ fontSize: 40 }} />
        </IconButton>

        {lightbox && (
          <img
            src={lightbox}
            alt="zoom"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              objectFit: "contain",
            }}
          />
        )}
      </Dialog>
    </Box>
  );
}
