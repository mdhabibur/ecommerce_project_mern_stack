import { Container, Row, Col } from "react-bootstrap";


const Footer = () => {
    const currentYear = new Date().getFullYear()

  return (
    <footer className="text-bg-light fw-bold">
        <Container>
            <Row>
                <Col className="text-center py-3">
                    <p>ProShop &copy; {currentYear} </p>
                </Col>
            </Row>
        </Container>

    </footer>
  )

}

export default Footer