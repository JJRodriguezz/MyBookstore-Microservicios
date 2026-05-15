import React, { useContext } from "react";
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h3>No estás autenticado</h3>
      </Container>
    );
  }

  const displayName = user.name || user.username || user.email?.split("@")[0] || "Usuario";
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <Container className="py-5 text-start">
      <h2 className="mb-4">Mi perfil</h2>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow rounded-4 p-4">
            <Row>
              <Col md={4} className="d-flex justify-content-center align-items-start">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="rounded-circle"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "150px",
                      height: "150px",
                      fontSize: "3rem",
                    }}
                    aria-hidden
                  >
                    {initial}
                  </div>
                )}
              </Col>

              <Col md={8}>
                <h3>{displayName}</h3>

                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Email:</strong> {user.email}
                  </ListGroup.Item>
                  {user.phone && (
                    <ListGroup.Item>
                      <strong>Teléfono:</strong> {user.phone}
                    </ListGroup.Item>
                  )}
                  {user.address && typeof user.address === "object" && (
                    <ListGroup.Item>
                      <strong>Dirección:</strong>{" "}
                      {[
                        user.address.address,
                        user.address.city,
                        user.address.state,
                        user.address.postalCode,
                        user.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
