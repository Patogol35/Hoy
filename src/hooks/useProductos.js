import { useEffect, useState, useMemo } from "react";
import { getProductos } from "../api/api";

export function useProductos({ categoria, search, sort }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProductos(categoria ? { categoria } : {})
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        setProductos(lista);
      })
      .catch((e) => {
        setError(e);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, [categoria]);

  const filtered = useMemo(() => {
    let result = productos;

    if (search) {
      result = result.filter((p) =>
        p.nombre?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "asc") {
      result = [...result].sort((a, b) => a.precio - b.precio);
    } else if (sort === "desc") {
      result = [...result].sort((a, b) => b.precio - a.precio);
    }

    return result;
  }, [productos, search, sort]);

  return { productos: filtered, loading, error };
}
