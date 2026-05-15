import React, { useState, useEffect, useContext } from "react";
import { api } from "../lib/api";
import { enrichBook } from "../lib/bookPresentation";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const BookScreen = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useCart();

  const [book, setBook] = useState({});
  const [stock, setStock] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [orderMsg, setOrderMsg] = useState(null);
  const [reviewMsg, setReviewMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const bookRes = await api.get(`/books/${id}`);
        const [invRes, revRes] = await Promise.all([
          api.get(`/inventory/${id}`).catch(() => ({ data: null })),
          api.get(`/reviews/${id}`).catch(() => ({ data: [] })),
        ]);
        setBook(enrichBook(bookRes.data));
        setStock(invRes.data);
        setReviews(Array.isArray(revRes.data) ? revRes.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) return;
    setOrderMsg(null);
    try {
      await api.post("/orders", {
        userId: user.id,
        bookId: Number(id),
      });
      setOrderMsg({
        variant: "success",
        text: "¡Pedido realizado correctamente!",
      });
      const { data: inv } = await api.get(`/inventory/${id}`);
      setStock(inv);
    } catch (e) {
      setOrderMsg({
        variant: "danger",
        text:
          e.response?.data?.error ||
          e.message ||
          "No se pudo completar el pedido",
      });
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user || !reviewText.trim()) return;
    setReviewMsg(null);
    try {
      await api.post("/reviews", {
        bookId: String(id),
        userId: String(user.id),
        content: reviewText.trim(),
      });
      setReviewText("");
      const { data: rev } = await api.get(`/reviews/${id}`);
      setReviews(Array.isArray(rev) ? rev : []);
      setReviewMsg({ variant: "success", text: "Reseña publicada." });
    } catch (e) {
      setReviewMsg({
        variant: "danger",
        text:
          e.response?.data?.error ||
          "No se pudo publicar la reseña",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-start">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="light" aria-label="Regresar a la página principal">
            ← Regresar al Catálogo
          </Button>
        </Link>
      </div>

      {orderMsg && (
        <Alert variant={orderMsg.variant} dismissible onClose={() => setOrderMsg(null)}>
          {orderMsg.text}
        </Alert>
      )}

      <Row className="text-start">
        <Col md={4}>
          <Image
            src={book.image}
            alt={book.name}
            fluid
            rounded
            className="shadow-sm"
          />
        </Col>

        <Col md={5}>
          <Card className="shadow rounded-4 border-0">
            <Card.Body>
              <h3>{book.name}</h3>
              <p className="text-muted mb-2">Autor: {book.author}</p>
              <p className="mb-0">{book.description}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow rounded-4 border-0">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Precio:</strong> {book.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  {stock == null ? (
                    "Stock: —"
                  ) : stock.available ? (
                    <>
                      Stock: <strong>{stock.quantity}</strong> uds disponibles
                    </>
                  ) : (
                    "Sin stock"
                  )}
                </ListGroup.Item>
              </ListGroup>
              {user ? (
                <>
                  <Button
                    className="w-100 mt-3 rounded-pill"
                    variant="primary"
                    disabled={stock != null && !stock.available}
                    onClick={handlePurchase}
                  >
                    Comprar ahora
                  </Button>
                  <Button
                    className="w-100 mt-2 rounded-pill"
                    variant="outline-primary"
                    onClick={() => addItem(book)}
                  >
                    Añadir al carrito
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  className="w-100 mt-3 rounded-pill"
                  variant="secondary"
                >
                  Inicia sesión para comprar
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 text-start">
        <Col md={10}>
          <h4 className="mb-3">Reseñas</h4>
          {reviews.length === 0 ? (
            <p className="text-muted">Aún no hay reseñas para este libro.</p>
          ) : (
            reviews.map((r) => (
              <Card key={r.id} className="mb-2 shadow-sm rounded-3">
                <Card.Body>
                  <small className="text-muted">Usuario #{r.user_id}</small>
                  <p className="mb-0 mt-1">{r.content}</p>
                </Card.Body>
              </Card>
            ))
          )}

          {user && (
            <Form className="mt-4" onSubmit={handleReview}>
              {reviewMsg && (
                <Alert
                  variant={reviewMsg.variant}
                  dismissible
                  onClose={() => setReviewMsg(null)}
                >
                  {reviewMsg.text}
                </Alert>
              )}
              <Form.Group>
                <Form.Label>Escribe una reseña</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tu opinión sobre el libro..."
                />
              </Form.Group>
              <Button
                type="submit"
                className="mt-2 rounded-pill"
                variant="primary"
              >
                Publicar reseña
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
};

export default BookScreen;
