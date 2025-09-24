import { useEffect, useState } from "react";
import { getProductos, getCategorias } from "../api/api";
import ProductoCard from "../components/ProductoCard";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Divider,
  TextField,
  Stack,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  IconButton,
  Chip,
  Button,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Slider from "react-slick";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoria, setCategoria] = useState("");

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [lightbox, setLightbox] = useState(null);

  const { agregarAlCarrito } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 PAGINACIÓN
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductos(categoria ? { categoria } : {})
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        setProductos(lista);
        setPage(1); // Reinicia a página 1 si cambia categoría
      })
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, [categoria]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
      setPage(1); // Reinicia a página 1 si cambia búsqueda
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const filtered = (productos || [])
    .filter((p) =>
      debouncedSearch === ""
        ? true
        : p.nombre?.toLowerCase().includes(debouncedSearch)
    )
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  // 🔹 Productos de la página actual
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const handleAdd = async (prod) => {
    try {
      await agregarAlCarrito(prod.id, 1);
      toast.success(`${prod.nombre} agregado al carrito ✅`); // ✅ corregido
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleCarritoClick = () => {
    if (!user) {
      toast.warning("Debes iniciar sesión para acceder al carrito ⚠️");
      return;
    }
    navigate("/carrito");
  };

  if (loading)
    return (
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            bgcolor: "#FFF9E6",
            color: "#8A6D3B",
            p: 2,
            borderRadius: 2,
            mb: 4,
            border: "1px solid #FFECB3",
            textAlign: "center",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          ⚠️ Esta es una aplicación demostrativa. Los pedidos no son reales.
        </Box>
      </motion.div>

      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <StorefrontIcon sx={{ fontSize: 32 }} /> Productos
        </Typography>
        <Divider
          sx={{
            width: 80,
            mx: "auto",
            borderBottomWidth: 3,
            borderColor: "primary.main",
            borderRadius: 2,
            mb: 3,
          }}
        />

        {/* Buscador, categoría y ordenamiento */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            placeholder="Buscar producto..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 250 } }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoria}
              label="Categoría"
              onChange={(e) => setCategoria(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sort}
              label="Ordenar por"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="desc">Precio: mayor a menor</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Grid de productos */}
      {paginated.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}>
          <ShoppingCartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
          <Typography variant="h6">No se encontraron productos.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {paginated.map((prod, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={prod.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ display: "flex", width: "100%", justifyContent: "center" }}
                >
                  <ProductoCard
                    producto={prod}
                    onVerDetalle={() => {
                      setSelected(prod);
                      setOpen(true);
                    }}
                    onAgregar={handleAdd}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* 🔹 Paginación */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filtered.length / itemsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}

      {/* Modal de detalle */}
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

                  <Typography
                    sx={{ lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}
                  >
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
                        transform:
                          selected.stock > 0 ? "translateY(-2px)" : "none",
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

      {/* ✅ Botón flotante Carrito */}
      <IconButton
        color="primary"
        onClick={handleCarritoClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "primary.main",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": {
            bgcolor: "primary.dark",
            transform: "scale(1.05)",
          },
          zIndex: 2000,
          p: 2,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 28 }} />
      </IconButton>
    </>
  );
                                          }
