import React from 'react';

/**
 * Contexto global da aplicacao. Centraliza o estado compartilhado entre telas:
 * usuario autenticado, token de sessao, exibicao do cabecalho e mensagens de
 * feedback (sucesso/erro). O valor real e fornecido pelo componente App.
 */
const AppContext = React.createContext({
    user: '',
    token: '',
    showHeader: true,
    messages: [],

    setUser: () => {},
    setToken: () => {},
    setShowHeader: () => {},
    setMessages: () => {},

    // Helpers de sessao e feedback (implementados no App).
    login: () => {},
    logout: () => {},
    pushMessage: () => {},
    handleError: () => {},
    handleSuccess: () => {},
    clearMessages: () => {},
    isAuthenticated: () => false,
});

export default AppContext;
