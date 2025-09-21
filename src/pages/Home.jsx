import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
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
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");

  // Modal detalle
  const [selected, setSelected] = useState(null);

  // Lightbox (zoom de imagen)
  const [lightbox, setLightbox] = useState(null);

  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    getProductos()
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        setProductos(lista);
      })
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (productos || [])
    .filter((p) =>
      search === "" ? true : p.nombre?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  const handleAdd = async (prod) => {
    try {
      await agregarAlCarrito(prod.id, 1);
      toast.success(`${prod.nombre} agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
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
            justifyContent: "center",
            alignItems: "center",
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

        {/* Buscador y ordenamiento */}
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}>
          <ShoppingCartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
          <Typography variant="h6">No se encontraron productos.</Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {filtered.map((prod, i) => (
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
                  onVerDetalle={() => setSelected(prod)}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Detalle */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="lg"
        fullWidth
      >
        {selected && (
          <Box sx={{ p: 3, position: "relative" }}>
            <IconButton
              onClick={() => setSelected(null)}
              sx={{ position: "absolute", top: 12, right: 12 }}
            >
              <CloseIcon />
            </IconButton>
            <Grid container spacing={4}>
              {/* Imagen con zoom */}
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={selected.imagen}
                  alt={selected.nombre}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    objectFit: "contain",
                    cursor: "zoom-in",
                  }}
                  onClick={() => setLightbox(selected.imagen)}
                />
              </Grid>

              {/* Info producto */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Typography variant="h5" fontWeight="bold">
                    {selected.nombre}
                  </Typography>

                  <Typography variant="h6" color="primary">
                    ${selected.precio}
                  </Typography>

                  <Divider />

                  <Typography>{selected.descripcion}</Typography>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAdd(selected)}
                  >
                    Agregar al carrito
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Dialog>

      {/* Lightbox Zoom */}
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
