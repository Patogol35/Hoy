export const calcularSubtotal = (it) =>
  Number(it.subtotal || it.cantidad * (it.producto?.precio || 0));
