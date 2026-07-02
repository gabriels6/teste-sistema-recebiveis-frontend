import { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { MessageHolder } from '../../components';
import './styles.css';

/** Tela de login. Autentica via API e abre a sessao (token) atraves do contexto. */
const LoginPage = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // O cabecalho fica oculto na tela de login; se ja houver sessao, vai para a home.
    useEffect(() => {
        appContext.setShowHeader(false);
        if (appContext.isAuthenticated()) {
            navigate('/home');
        }
        return () => appContext.setShowHeader(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        appContext.clearMessages();
        appContext
            .login(nome, senha)
            .then(() => {
                appContext.setShowHeader(true);
                navigate('/home');
            })
            .catch((error) => appContext.handleError(error))
            .finally(() => setSubmitting(false));
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Sistema de Recebiveis</h1>
                <p className="login-subtitle">Acesse com suas credenciais</p>
                <MessageHolder />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="login-nome">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite seu usuario"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="login-senha">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
                        {submitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
