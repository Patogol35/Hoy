// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  Pagination,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const productosData = [
  {
    id: 1,
    nombre: "Laptop Dell XPS",
    descripcion: "Ultrabook de alto rendimiento con pantalla InfinityEdge.",
    precio: 1200,
    imagen: "https://picsum.photos/seed/dell/600/400",
    categoria: "Laptops",
    nuevo: true,
    stock: 5,
  },
  {
    id: 2,
    nombre: "PlayStation 5",
    descripcion: "Consola de nueva generación con control DualSense.",
    precio: 650,
    imagen: "https://picsum.photos/seed/ps5/600/400",
    categoria: "Consolas",
    nuevo: false,
    stock: 0,
  },
  {
    id: 3,
    nombre: "iPhone 15 Pro",
    descripcion: "Smartphone Apple con chip A17 y cámara avanzada.",
    precio: 1100,
    imagen: "https://picsum.photos/seed/iphone/600/400",
    categoria: "Celulares",
    nuevo: true,
    stock: 12,
  },
];

export default function Home() {
  const [productos, setProductos] = useState(productosData);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ordenar, setOrdenar] = useState("");
  const [pagina, setPagina] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const productosPorPagina = 6;

  const handleAdd = (producto) => {
    console.log("Agregado al carrito:", producto);
  };

  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  const productosFiltrados = productos
    .filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((p) => (categoria ? p.categoria === categoria : true))
    .sort((a, b) => {
      if (ordenar === "precioAsc") return a.precio - b.precio;
      if (ordenar === "precioDesc") return b.precio - a.precio;
      return 0;
    });

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * productosPorPagina,
    pagina * productosPorPagina
  );

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛒 Mi Tienda
          </Typography>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Filtros */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 4, px: 2 }}
      >
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          fullWidth
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <TextField
          select
          label="Categoría"
          size="small"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="Laptops">Laptops</MenuItem>
          <MenuItem value="Consolas">Consolas</MenuItem>
          <MenuItem value="Celulares">Celulares</MenuItem>
        </TextField>
        <TextField
          select
          label="Ordenar"
          size="small"
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Por defecto</MenuItem>
          <MenuItem value="precioAsc">Precio: Menor a Mayor</MenuItem>
          <MenuItem value="precioDesc">Precio: Mayor a Menor</MenuItem>
        </TextField>
      </Stack>

      {/* Productos */}
      <Grid container spacing={3} px={2}>
        {productosPagina.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.imagen}
                  alt={producto.nombre}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {producto.nombre}
                  </Typography>
                  <Typography color="primary" fontWeight="bold">
                    ${producto.precio}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleVerDetalle(producto)}>
                    Ver Detalle
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAdd(producto)}
                    disabled={producto.stock === 0}
                  >
                    {producto.stock > 0 ? "Agregar" : "Agotado"}
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Paginación */}
      <Stack alignItems="center" sx={{ my: 4 }}>
        <Pagination
          count={totalPaginas}
          page={pagina}
          onChange={(e, value) => setPagina(value)}
        />
      </Stack>

      {/* Modal Detalle Producto */}
      <Dialog
        open={Boolean(productoSeleccionado)}
        onClose={handleCerrarDetalle}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 40 },
          transition: { duration: 0.3, ease: "easeOut" },
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            backgroundColor: "#fff",
          },
        }}
      >
        {productoSeleccionado && (
          <>
            {/* Imagen */}
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                sx={{
                  width: "100%",
                  height: 350,
                  objectFit: "cover",
                }}
              />

              {productoSeleccionado.nuevo && (
                <Chip
                  label="Nuevo"
                  color="secondary"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                    px: 1.5,
                    borderRadius: 2,
                  }}
                />
              )}

              <IconButton
                onClick={handleCerrarDetalle}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Contenido */}
            <DialogContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {productoSeleccionado.nombre}
              </Typography>

              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                ${productoSeleccionado.precio}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
              >
                {productoSeleccionado.descripcion ||
                  "Este producto no tiene descripción disponible."}
              </Typography>

              {/* Botones */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={handleCerrarDetalle}
                    variant="outlined"
                    color="inherit"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                    }}
                  >
                    Cerrar
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => {
                      handleAdd(productoSeleccionado);
                      handleCerrarDetalle();
                    }}
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      fontWeight: "bold",
                    }}
                    disabled={productoSeleccionado.stock === 0}
                  >
                    {productoSeleccionado.stock > 0
                      ? "Agregar al carrito"
                      : "Agotado"}
                  </Button>
                </motion.div>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
              }
