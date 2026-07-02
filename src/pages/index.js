import { Routes, Route, Navigate } from 'react-router-dom';
import { CrudPage, ProtectedRoute } from '../components';
import ENTITIES from '../config/entities';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import PrecificacaoPage from './PrecificacaoPage';
import ExtratoLiquidacaoPage from './ExtratoLiquidacaoPage';

// Entidades expostas como telas de CRUD (rota /cadastros/<resource>).
const CRUD_RESOURCES = [
    'funcaos',
    'usuarios',
    'cedentes',
    'moedas',
    'tipos-recebiveis',
    'taxas-cambio',
    'recebiveis',
    'transacoes',
];

/** Envolve um elemento com a protecao de sessao. */
function protectedElement(element) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
}

/** Tabela central de rotas da aplicacao. */
const Router = () => (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={protectedElement(<HomePage />)} />

        {CRUD_RESOURCES.map((resource) => (
            <Route
                key={resource}
                path={`/cadastros/${resource}`}
                element={protectedElement(<CrudPage entity={ENTITIES[resource]} />)}
            />
        ))}

        <Route path="/precificacao" element={protectedElement(<PrecificacaoPage />)} />
        <Route
            path="/relatorios/extrato-liquidacao"
            element={protectedElement(<ExtratoLiquidacaoPage />)}
        />

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
);

export default Router;
