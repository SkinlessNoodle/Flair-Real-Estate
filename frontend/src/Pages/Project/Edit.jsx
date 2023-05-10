// Edit Project given the project id

import React, { useState, useEffect } from "react";
import { Container, ButtonGroup, Button } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import { useNavigate } from "react-router-dom";

const EditProject = () => {
    const navigate = useNavigate();
    //display under construction message
    return (
        <Container>
            <ContentHeader headerTitle="Edit Project"
                breadcrumb={[
                    { name: "Home", link: "/" },
                    { name: "Projects", link: "/projects" },
                    { name: "Edit", active: true },
                ]}
                options={[
                    <ButtonGroup>
                        {/* navigate to earlier page */}
                        <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
                    </ButtonGroup>
                ]}
            />
            {/* display a bootstrap under construction page */}
            <div className="text-center">
                <h1>Under Construction</h1>
                <img src="https://media2.giphy.com/media/hvN3SkNMRSB7mZa8JL/giphy.gif" alt="Under Construction" />
            </div>
        </Container>
    );
};

export default EditProject;