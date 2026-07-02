import { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

/**
 * Cabecalho de navegacao. So aparece com sessao ativa e reune, por grupos, os
 * cadastros (CRUD), a precificacao e o relatorio de extrato de liquidacao.
 */
const Header = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    function logout() {
        appContext.logout();
        navigate('/login');
    }

    if (!appContext.showHeader || !appContext.isAuthenticated()) {
        return null;
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to="/home">
                    <Navbar.Brand>Sistema de Recebiveis</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <NavDropdown title="Cadastros" menuVariant="dark" id="nav-cadastros">
                            <LinkContainer to="/cadastros/funcaos">
                                <NavDropdown.Item>Funcoes</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/usuarios">
                                <NavDropdown.Item>Usuarios</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/cedentes">
                                <NavDropdown.Item>Cedentes</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/moedas">
                                <NavDropdown.Item>Moedas</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/tipos-recebiveis">
                                <NavDropdown.Item>Tipos de Recebivel</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/taxas-cambio">
                                <NavDropdown.Item>Taxas de Cambio</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/recebiveis">
                                <NavDropdown.Item>Recebiveis</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/cadastros/transacoes">
                                <NavDropdown.Item>Transacoes</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/precificacao">
                            <Nav.Link>Precificacao</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/relatorios/extrato-liquidacao">
                            <Nav.Link>Extrato de Liquidacao</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav className="align-items-lg-center">
                        {appContext.user ? (
                            <Navbar.Text className="me-3">Ola, {appContext.user}</Navbar.Text>
                        ) : null}
                        <Button variant="outline-light" size="sm" onClick={logout}>
                            Sair
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
