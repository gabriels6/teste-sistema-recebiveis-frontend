import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';

/**
 * Envolve uma rota que exige sessao ativa. Sem token de autenticacao, redireciona
 * para a tela de login.
 */
const ProtectedRoute = ({ children }) => {
    const appContext = useContext(AppContext);

    if (!appContext.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
