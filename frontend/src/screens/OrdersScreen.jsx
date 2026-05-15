import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { api } from "../lib/api";
import { enrichBooks } from "../lib/bookPresentation";

const OrdersScreen = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, booksRes] = await Promise.all([
          api.get("/orders"),
          api.get("/books"),
        ]);
        const mine = (ordersRes.data || []).filter(
          (o) => Number(o.user_id) === Number(user.id)
        );
        setOrders(mine);
        setBooks(enrichBooks(booksRes.data || []));
      } catch (e) {
        setError(e.response?.data?.error || "No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const titleByBookId = useMemo(() => {
    const m = {};
    books.forEach((b) => {
      m[String(b.id)] = b.title || b.name;
    });
    return m;
  }, [books]);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <p>Inicia sesión para ver tus pedidos.</p>
        <Button as={Link} to="/login" variant="primary" className="rounded-pill">
          Iniciar sesión
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-4 text-start">
      <h2 className="mb-4">Mis pedidos</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow rounded-4 border-0">
        <Card.Body className="p-0">
          {orders.length === 0 ? (
            <p className="p-4 mb-0 text-muted">
              Aún no tienes pedidos. Explora el{" "}
              <Link to="/">catálogo</Link>.
            </p>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th># Pedido</th>
                  <th>Libro</th>
                  <th>ID libro</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <Link to={`/book/${o.book_id}`}>
                        {titleByBookId[String(o.book_id)] || `Libro #${o.book_id}`}
                      </Link>
                    </td>
                    <td>{o.book_id}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrdersScreen;
