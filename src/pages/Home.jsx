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

      {/* Modal Detalle Producto - NUEVO DISEÑO */}
      <Dialog
        open={Boolean(productoSeleccionado)}
        onClose={handleCerrarDetalle}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            maxHeight: "90vh", // ✅ limita la altura para horizontal
          },
        }}
      >
        {productoSeleccionado && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              height: "100%",
            }}
          >
            {/* Imagen */}
            <Box
              sx={{
                flex: { xs: "0 0 auto", md: "1 1 45%" },
                bgcolor: "#f9f9f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                p: 2,
              }}
            >
              <Box
                component="img"
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                sx={{
                  maxWidth: "100%",
                  maxHeight: { xs: 300, md: "100%" },
                  objectFit: "contain",
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
            <DialogContent
              sx={{
                flex: 1,
                p: 3,
                overflowY: "auto", // ✅ scroll interno si hay mucho texto
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {productoSeleccionado.nombre}
              </Typography>

              <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                ${productoSeleccionado.precio}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                {productoSeleccionado.descripcion ||
                  "Este producto no tiene descripción disponible."}
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
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
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </>
  );
      }
