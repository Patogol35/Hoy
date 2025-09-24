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
  open={Boolean(productoSeleccionado)}
  onClose={handleCerrarDetalle}
  fullWidth
  maxWidth="md"
  PaperProps={{
    component: motion.div,
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.35 },
    sx: {
      borderRadius: { xs: 0, sm: 4 },       // fullscreen en móvil, elegante en desktop
      width: { xs: "100%", sm: "600px" },   // ocupa todo en móvil, ancho fijo en desktop
      m: { xs: 0, sm: "auto" },             // sin margen en móvil, centrado en desktop
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  }}
>
  {productoSeleccionado && (
    <>
      {/* Imagen */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 240, sm: 320 },
          background: "linear-gradient(135deg, #f5f7fa, #e4ebf7)",
        }}
      >
        <Box
          component="img"
          src={productoSeleccionado.imagen}
          alt={productoSeleccionado.nombre}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.6s ease",
            "&:hover": { transform: "scale(1.05)" },
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
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />
        )}

        <IconButton
          onClick={handleCerrarDetalle}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido */}
      <DialogContent
        sx={{
          flex: 1,
          p: { xs: 2.5, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* Nombre */}
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            textAlign={{ xs: "center", sm: "left" }}
          >
            {productoSeleccionado.nombre}
          </Typography>

          {/* Precio */}
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 1,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            ${productoSeleccionado.precio}
          </Typography>

          {/* Stock */}
          <Typography
            variant="body2"
            sx={{
              color:
                productoSeleccionado.stock > 0 ? "success.main" : "error.main",
              mb: 2,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {productoSeleccionado.stock > 0
              ? `Disponible (${productoSeleccionado.stock} unidades)`
              : "Sin stock"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Descripción */}
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.6 }}
          >
            {productoSeleccionado.descripcion ||
              "Este producto no tiene descripción disponible."}
          </Typography>
        </Box>

        {/* Botones */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={handleCerrarDetalle}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 3, width: { xs: "100%", sm: "auto" } }}
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
                px: 3,
                width: { xs: "100%", sm: "auto" },
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
      
    </>
  );
}
