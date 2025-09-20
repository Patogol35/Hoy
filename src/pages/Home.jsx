import { useEffect, useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const { agregarAlCarrito } = useCarrito();

  // 🔹 Función para traer todos los productos
  const fetchAllProductos = async () => {
    let url = "/api/productos/"; // ruta relativa para Vercel
    let all = [];
    try {
      while (url) {
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          all = [...all, ...data];
          url = null;
        } else if (data?.results) {
          all = [...all, ...data.results];
          url = data.next;
        } else {
          all = [];
          url = null;
        }
      }
      setProductos(all);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProductos();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const filtered = productos
    .filter((p) =>
      debouncedSearch === ""
        ? true
        : p.nombre?.toLowerCase().includes(debouncedSearch)
    )
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
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
          sx={{ color: "primary.main" }}
        >
          🛍️ Productos
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

      {/* Grid de productos */}
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
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <ProductoCard
                  producto={prod}
                  onVerDetalle={() => {
                    setSelected(prod);
                    setOpen(true);
                  }}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal detalle producto */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        {selected && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">
                {selected.nombre}
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Slider de imágenes */}
            {selected.imagenes?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Slider {...settings}>
                  {selected.imagenes.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={img} // asegúrate que img sea la URL correcta
                        alt={selected.nombre}
                        style={{
                          maxHeight: "400px",
                          width: "100%",
                          objectFit: "contain",
                          cursor: "pointer",
                        }}
                        onClick={() => setLightbox(img)}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            )}

            <Typography sx={{ mt: 2 }}>{selected.descripcion}</Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Chip label={`Precio: $${selected.precio}`} color="primary" />
              {selected.categoria && <Chip label={`Categoría: ${selected.categoria}`} />}
            </Stack>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => handleAdd(selected)}
            >
              Agregar al carrito
            </Button>
          </Box>
        )}
      </Dialog>

      {/* Lightbox simple */}
      {lightbox && (
        <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="lg">
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setLightbox(null)}
              sx={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={lightbox}
              alt="Imagen producto"
              style={{
                maxHeight: "80vh",
                width: "100%",
                objectFit: "contain",
                background: "#000",
              }}
            />
          </Box>
        </Dialog>
      )}
    </>
  );
}  
