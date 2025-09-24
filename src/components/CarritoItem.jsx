import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { toast } from "react-toastify";
import { calcularSubtotal } from "../utils/carritoUtils";

export default function CarritoItem({
  it,
  theme,
  incrementar,
  decrementar,
  setCantidad,
  eliminarItem,
}) {
  const stock = it.producto?.stock ?? 0;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
        transition: "all 0.3s",
        "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
      }}
    >
      <CardMedia
        component="img"
        image={it.producto?.imagen || undefined}
        alt={it.producto?.nombre}
        sx={{
          width: { xs: "100%", sm: 160 },
          height: { xs: 200, sm: 160 },
          objectFit: "contain",
          borderRadius: { xs: "12px 12px 0 0", sm: "12px 0 0 12px" },
          bgcolor: theme.palette.mode === "dark" ? "#333" : "#fafafa",
          border: "1px solid #eee",
          p: 1,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {it.producto?.nombre}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 1,
            }}
          >
            {it.producto?.descripcion}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<MonetizationOnIcon />}
            label={`$${calcularSubtotal(it).toFixed(2)}`}
            color="success"
            sx={{ fontWeight: "bold" }}
          />
          <Chip
            label={`Stock: ${stock} unidades`}
            color={stock > 0 ? "info" : "default"}
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      </CardContent>

      {/* Controles cantidad + eliminar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => decrementar(it)}>
            <RemoveIcon />
          </IconButton>

          <TextField
            type="number"
            size="small"
            value={it.cantidad}
            inputProps={{ min: 1, max: stock }}
            onChange={(e) => {
              const nuevaCantidad = Number(e.target.value);
              if (nuevaCantidad >= 1 && nuevaCantidad <= stock) {
                setCantidad(it.id, nuevaCantidad);
              } else if (nuevaCantidad > stock) {
                toast.warning(`No puedes pedir más de ${stock} unidades`);
                setCantidad(it.id, stock);
              }
            }}
            sx={{
              width: 60,
              "& input": {
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
              },
            }}
          />

          <IconButton
            onClick={() => incrementar(it)}
            disabled={it.cantidad >= stock}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <IconButton
          onClick={() => eliminarItem(it.id)}
          sx={{ color: "error.main", "&:hover": { bgcolor: "rgba(211,47,47,0.1)" } }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
      }
