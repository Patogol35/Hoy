import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Pagination,
  IconButton,
  CircularProgress,
  Paper,
  Dialog,
  DialogContent,
  Button,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";

import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import { useCarritoHandler } from "../hooks/useCarritoHandler";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [categoria, setCategoria] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const categorias = useCategorias();
  const { loading, filtered, paginated, page, setPage } = useProductos({
    categoria,
    search,
    sort,
    itemsPerPage: ITEMS_PER_PAGE,
  });
  const { handleAdd, handleCarritoClick } = useCarritoHandler();

  const handleVerDetalle = (producto) => setProductoSeleccionado(producto);
  const handleCerrarDetalle = () => setProductoSeleccionado(null);

  if (loading) {
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* ================== ENCABEZADO ================== */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "primary.main" }}
        >
          <StorefrontIcon sx={{ fontSize: 32, mr: 1 }} />
          Productos
        </Typography>
        <Divider
          sx={{ width: 80, mx: "auto", borderBottomWidth: 3, mb: 3 }}
        />

        {/* ================== FILTROS ================== */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Buscar */}
          <TextField
            label="Buscar producto"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          {/* Categoría */}
          <TextField
            select
            label="Categoría"
            size="small"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StorefrontIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>

          {/* Ordenar */}
          <TextField
            select
            label="Ordenar por"
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SortIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="asc">Precio: menor a mayor</MenuItem>
            <MenuItem value="desc">Precio: mayor a menor</MenuItem>
          </TextField>
        </Paper>
      </Box>

      {/* ================== PRODUCTOS ================== */}
      <Grid container spacing={3} justifyContent="center">
        {paginated.map((prod) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProductoCard
                producto={prod}
                onAgregar={handleAdd}
                onVerDetalle={() => handleVerDetalle(prod)}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* ================== PAGINACIÓN ================== */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* ================== BOTÓN CARRITO ================== */}
      <IconButton
        onClick={handleCarritoClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <ShoppingCartIcon />
      </IconButton>

      {/* ================== MODAL DETALLE ================== */}
      
<Dialog
  open={open}
  onClose={() => setOpen(false)}
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
      maxWidth: { md: 900 },
      width: "100%",
      position: "relative",
    },
  }}
>
  {selected && (
    <Box>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bgcolor: "rgba(0,0,0,0.6)",
          color: "white",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Grid container spacing={4}>
        {/* Slider de imágenes */}
        <Grid item xs={12} md={6}>
          <Slider {...settings}>
            {(selected.imagenes || [selected.imagen]).map((img, i) => (
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
                <Box
                  component="img"
                  src={img}
                  alt={selected.nombre}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Grid>

        {/* Información del producto */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold">
              {selected.nombre}
            </Typography>

            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 1 }}
              >
                ${selected.precio}
              </Typography>

              <Chip
                label={selected.stock > 0 ? "En stock" : "Agotado"}
                color={selected.stock > 0 ? "success" : "error"}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

            <Typography sx={{ lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
              {selected.descripcion}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => handleAdd(selected)}
              disabled={selected.stock === 0}
              sx={{
                borderRadius: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                "&:hover": {
                  transform: selected.stock > 0 ? "translateY(-2px)" : "none",
                },
              }}
            >
              {selected.stock > 0 ? "Agregar al carrito" : "Agotado"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )}
</Dialog>

{/* Lightbox */}
<Dialog
  open={!!lightbox}
  onClose={() => setLightbox(null)}
  fullScreen
  sx={{ zIndex: 1600 }}
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
      top: 16,
      right: 16,
      bgcolor: "rgba(0,0,0,0.6)",
      color: "white",
    }}
  >
    <CloseIcon />
  </IconButton>
  <Box
    component="img"
    src={lightbox}
    alt="Zoom"
    sx={{
      maxWidth: "95%",
      maxHeight: "95%",
      objectFit: "contain",
    }}
  />
</Dialog>
      
    </>
  );
}
