import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import AppContext from './context/AppContext';
import { Header } from './components';
import Router from './pages';
import recebiveisApi, { setAuthToken } from './utils/api';
import './App.css';

/**
 * Componente raiz. Concentra o estado global (usuario, token, mensagens),
 * controla a sessao com o token de autenticacao (persistido em cookie) e
 * disponibiliza tudo via AppContext para as demais telas.
 */
function App() {
    const [cookies, setCookies, removeCookies] = useCookies(['token', 'user']);

    const [user, setUser] = useState(cookies.user || '');
    const [token, setToken] = useState(cookies.token || '');
    const [showHeader, setShowHeader] = useState(true);
    const [messages, setMessages] = useState([]);

    // Restaura a sessao a partir do cookie ao carregar / recarregar a pagina.
    useEffect(() => {
        if (!token && cookies.token) {
            setToken(cookies.token);
            setUser(cookies.user || '');
        }
        // Mantem o token do axios sincronizado com o estado atual.
        setAuthToken(token || cookies.token || '');
    }, [token, cookies.token, cookies.user]);

    function pushMessage(type, value) {
        setMessages((current) => [...current, { type, value }]);
    }

    function handleError(error) {
        pushMessage('error', error?.message || String(error));
    }

    function handleSuccess(message) {
        pushMessage('success', message);
    }

    function clearMessages() {
        setMessages([]);
    }

    /** Autentica o usuario e abre a sessao (estado + cookie + token do axios). */
    async function login(nome, senha) {
        const auth = await recebiveisApi.login(nome, senha);
        setAuthToken(auth.token);
        setToken(auth.token);
        setUser(nome);
        setCookies('token', auth.token, { path: '/' });
        setCookies('user', nome, { path: '/' });
        return auth;
    }

    /** Encerra a sessao: limpa estado, cookie e token do axios. */
    function logout() {
        setAuthToken('');
        setToken('');
        setUser('');
        removeCookies('token', { path: '/' });
        removeCookies('user', { path: '/' });
    }

    function isAuthenticated() {
        return Boolean(token || cookies.token);
    }

    const contextValue = {
        user,
        token,
        showHeader,
        messages,
        setUser,
        setToken,
        setShowHeader,
        setMessages,
        login,
        logout,
        pushMessage,
        handleError,
        handleSuccess,
        clearMessages,
        isAuthenticated,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Header />
            <Router />
        </AppContext.Provider>
    );
}

export default App;
