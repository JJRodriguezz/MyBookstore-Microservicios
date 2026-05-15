import React, { useContext, useState } from "react";
import { Container, Card, Button, ListGroup, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../lib/api";

const CartScreen = () => {
  const { user } = useContext(AuthContext);
  const { items, removeItem, clearCart } = useCart();
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const checkout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      for (const item of items) {
        await api.post("/orders", {
          userId: user.id,
          bookId: Number(item.bookId),
        });
      }
      clearCart();
      navigate("/orders");
    } catch (e) {
      setMsg({
        variant: "danger",
        text:
          e.response?.data?.error ||
          "Error al finalizar la compra (stock o pago).",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <p>Inicia sesión para usar el carrito.</p>
        <Button as={Link} to="/login" variant="primary" className="rounded-pill">
          Iniciar sesión
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4 text-start">
      <h2 className="mb-4">Carrito</h2>

      {msg && (
        <Alert variant={msg.variant} dismissible onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}

      <Card className="shadow rounded-4 border-0">
        <Card.Body>
          {items.length === 0 ? (
            <p className="mb-0 text-muted">
              Tu carrito está vacío. Visita el <Link to="/">catálogo</Link>.
            </p>
          ) : (
            <>
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item
                    key={item.bookId}
                    className="d-flex justify-content-between align-items-center px-0"
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div className="small text-muted">{item.author}</div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(item.bookId)}
                    >
                      Quitar
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                className="mt-4 rounded-pill w-100"
                variant="primary"
                disabled={busy}
                onClick={checkout}
              >
                {busy ? "Procesando…" : "Finalizar compra"}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CartScreen;
