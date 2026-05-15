import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const STORAGE_KEY = "mybookstore_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((book) => {
    const id = String(book.id);
    setItems((prev) => {
      const exists = prev.some((x) => String(x.bookId) === id);
      if (exists) return prev;
      return [
        ...prev,
        {
          bookId: id,
          title: book.title || book.name,
          author: book.author,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((bookId) => {
    setItems((prev) =>
      prev.filter((x) => String(x.bookId) !== String(bookId))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      itemCount: items.length,
    }),
    [items, addItem, removeItem, clearCart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
