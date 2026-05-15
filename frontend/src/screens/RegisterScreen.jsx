import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const RegisterScreen = () => {
  const { register } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "No se pudo registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card className="p-10 shadow rounded-4" style={{ width: "28rem" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Crear cuenta</h3>

          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="regName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Tu nombre"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="regEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="regPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Mínimo recomendado: 6 caracteres"
                required
                minLength={6}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3 rounded-pill py-2"
              disabled={loading}
            >
              {loading ? "Creando cuenta…" : "Registrarme"}
            </Button>

            <p className="text-center mt-3 mb-0 small">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterScreen;
