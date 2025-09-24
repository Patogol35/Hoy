import { useEffect, useState } from "react";
import { getProductos } from "../api/api";

export function useProductos({ categoria, search, sort }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      })
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, [categoria]);

  const filtered = productos
    .filter((p) =>
      !search ? true : p.nombre?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  return { productos: filtered, loading };
}
