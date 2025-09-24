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
        <Typography variant="h4" fontWeight="bold" sx={{ color: "primary.main" }}>
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
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
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

      {/* Modal Detalle Producto (Mejorado) */}
      <Dialog
        open={Boolean(productoSeleccionado)}
        onClose={handleCerrarDetalle}
        fullWidth
        maxWidth="md"
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: { xs: 2, sm: 4 },
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            bgcolor: "background.paper",
          },
        }}
      >
        {productoSeleccionado && (
          <Grid
            container
            sx={{
              flexDirection: { xs: "column", md: "row" },
              height: { xs: "auto", md: 500 },
            }}
          >
            {/* Imagen */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                position: "relative",
                bgcolor: "#f9f9f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: { xs: 2, md: 3 },
              }}
            >
              <Box
                component="img"
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: 2,
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
            </Grid>

            {/* Contenido */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ textAlign: { xs: "center", md: "left" } }}
                >
                  {productoSeleccionado.nombre}
                </Typography>

                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ textAlign: { xs: "center", md: "left" } }}
                >
                  ${productoSeleccionado.precio}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    textAlign: "justify",
                    maxHeight: { xs: 180, md: 250 },
                    overflowY: "auto",
                    pr: 1,
                  }}
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
                sx={{ mt: 3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={handleCerrarDetalle}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 3 }}
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
                    sx={{ borderRadius: 3 }}
                    disabled={productoSeleccionado.stock === 0}
                  >
                    {productoSeleccionado.stock > 0
                      ? "Agregar al carrito"
                      : "Agotado"}
                  </Button>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Dialog>
    </>
  );
                    }
