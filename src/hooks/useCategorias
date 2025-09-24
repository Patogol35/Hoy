import { useEffect, useState } from "react";
import { getCategorias } from "../api/api";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  return categorias;
}
