import React from 'react'
import { useTranslation } from "react-i18next"
import { Card } from 'react-bootstrap'
// import { useHistory, useLocation } from "react-router-dom";
import { Navigation } from './Navigation';

const ErrorPage = props => {
    const { t, ready } = useTranslation();
     /*
    let history = useHistory();
    // Getting state from ruoter
    const status = props.location.state || {};

    if(status !== "suspended"){
        history.push("/mmt")
    }*/

    function handleClick() {
        window.location.reload();
    }

    return (
        <div>
            <Navigation />
            <div className='container mt-5'>
                <div className="col-lg-6 offset-lg-3">
                <Card bg="danger" text="light" style={{ width: '100%'}}>
                    <Card.Header>{t("card_error_header")}</Card.Header>
                    <Card.Body>
                    <Card.Title>{t("card_error_title")}</Card.Title>
                    <Card.Text>
                        {t("card_error_body")}
                    </Card.Text>
                    <button className="btn btn-secondary btn-large btn-block mt-2" onClick={() => handleClick()}>{t("card_button")}</button>
                    </Card.Body>
                </Card>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage
