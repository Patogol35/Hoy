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
    itemsPerPage: 8,
  });
  const { handleAdd, handleCarritoClick } = useCarritoHandler();

  const handleVerDetalle = (producto) => setProductoSeleccionado(producto);
  const handleCerrarDetalle = () => setProductoSeleccionado(null);

  if (loading)
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          <StorefrontIcon sx={{ fontSize: 32 }} /> Productos
        </Typography>
        <Divider sx={{ width: 80, mx: "auto", borderBottomWidth: 3, mb: 3 }} />

        {/* Filtros */}
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
          {/* Buscador */}
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

      {/* Productos */}
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

      {/* Paginación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filtered.length / 8)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Botón Carrito */}
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

      {/* Modal premium detalle producto */}
      <Dialog
        open={Boolean(productoSeleccionado)}
        onClose={handleCerrarDetalle}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          },
        }}
      >
        {productoSeleccionado && (
          <>
            {/* Imagen con chip "Nuevo" */}
            <Box sx={{ position: "relative", height: 280, bgcolor: "#f9f9f9" }}>
              <Box
                component="img"
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.5s ease",
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
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Contenido */}
            <DialogContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {productoSeleccionado.nombre}
              </Typography>

              <Typography variant="subtitle1" color="primary" gutterBottom>
                ${productoSeleccionado.precio}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                {productoSeleccionado.descripcion ||
                  "Este producto no tiene descripción disponible."}
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={handleCerrarDetalle}
                  variant="outlined"
                  color="inherit"
                  sx={{ borderRadius: 3, textTransform: "none", px: 3 }}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    handleAdd(productoSeleccionado);
                    handleCerrarDetalle();
                  }}
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ borderRadius: 3, textTransform: "none", px: 3, fontWeight: "bold" }}
                  disabled={productoSeleccionado.stock === 0}
                >
                  {productoSeleccionado.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </Button>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
