/**
 * El book-service solo expone title/author en BD; imágenes y precios son assets locales del frontend.
 */
const BY_ID = {
  1: {
    price: "$12.990",
    image: "/images/img-1984.jpeg",
    description:
      "Distopía clásica sobre vigilancia estatal y manipulación de la verdad.",
  },
  2: {
    price: "$14.500",
    image: "/images/img-sapiens.jpeg",
    description:
      "Historia abreviada de la humanidad desde la revolución cognitiva hasta la era actual.",
  },
  3: {
    price: "$11.000",
    image: "/images/img-el-arte-de-la-guerra.jpeg",
    description:
      "Tratado estratégico sobre conflicto, ventaja táctica y liderazgo.",
  },
};

export function enrichBook(book) {
  if (!book || typeof book !== "object") return book;
  const id = Number(book.id);
  const extra = BY_ID[id] || {};
  const title = book.title ?? book.name ?? "Sin título";
  return {
    ...book,
    title,
    name: title,
    price: book.price ?? extra.price ?? "Consultar",
    image: book.image || extra.image || "/placeholder.png",
    description:
      book.description ??
      extra.description ??
      "Sin descripción detallada en catálogo.",
  };
}

export function enrichBooks(list) {
  return Array.isArray(list) ? list.map(enrichBook) : [];
}
