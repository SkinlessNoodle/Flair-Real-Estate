import React from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

const BuyersArticles = () => {
    return (
        <>
            <Sidebar />
            <Navbar />

            <Container>
                <Row >
                </Row>
                <Row style={{ marginTop: "5rem" }}>
                    <Col>
                    </Col>
                    <Col xs={9}>
                        <h1>Buyers Articles</h1>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BuyersArticles;