import { useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AppContext from '../../context/AppContext';
import './styles.css';

const SHORTCUTS = [
    { to: '/cadastros/cedentes', title: 'Cedentes', text: 'Gerencie os cedentes das operacoes.' },
    { to: '/cadastros/recebiveis', title: 'Recebiveis', text: 'Cadastre e edite os recebiveis.' },
    { to: '/cadastros/transacoes', title: 'Transacoes', text: 'Registre as operacoes realizadas.' },
    { to: '/precificacao', title: 'Precificacao', text: 'Calcule o valor presente de um recebivel.' },
    {
        to: '/relatorios/extrato-liquidacao',
        title: 'Extrato de Liquidacao',
        text: 'Consulte o relatorio de liquidacoes.',
    },
];

/** Painel inicial com atalhos para as principais areas do sistema. */
const HomePage = () => {
    const appContext = useContext(AppContext);

    return (
        <div className="page">
            <div className="page-title">Bem-vindo, {appContext.user || 'usuario'}</div>
            <p className="home-lead">Selecione uma area para comecar.</p>
            <Row xs={1} sm={2} lg={3} className="g-3">
                {SHORTCUTS.map((shortcut) => (
                    <Col key={shortcut.to}>
                        <LinkContainer to={shortcut.to}>
                            <Card className="home-card h-100" role="button">
                                <Card.Body>
                                    <Card.Title>{shortcut.title}</Card.Title>
                                    <Card.Text>{shortcut.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        </LinkContainer>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomePage;
