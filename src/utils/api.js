import axios from 'axios';

/**
 * Arquivo unico e centralizado de acesso a API de recebiveis.
 *
 * - Cria uma instancia axios apontando para a URL da API (ou para o proxy de dev).
 * - Injeta automaticamente o token de autenticacao (Bearer) em todas as chamadas.
 * - Desembrulha o envelope padrao da API ({ success, message, data, errors }).
 * - Normaliza os erros para uma Error com a mensagem de negocio vinda do back-end.
 */

const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL });

// Token mantido em memoria; a sessao (App/Context) o restaura a partir do cookie.
let authToken = '';

/** Define (ou limpa) o token usado no header Authorization das proximas chamadas. */
export function setAuthToken(token) {
    authToken = token || '';
}

// Interceptor de requisicao: adiciona o Bearer token quando existir.
api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

/** Extrai uma mensagem de erro legivel a partir da resposta padronizada da API. */
function extractError(error) {
    const payload = error.response?.data;
    if (payload) {
        const details = Array.isArray(payload.errors) ? payload.errors.join(' ') : '';
        const message = payload.message || 'Erro ao comunicar com o servidor.';
        return new Error(details ? `${message} (${details})` : message);
    }
    return new Error(error.message || 'Falha de conexao com o servidor.');
}

/** Desembrulha o campo `data` do envelope ApiResponse. */
function unwrap(response) {
    return response.data?.data;
}

/**
 * CRUD generico para as entidades REST da API. Todas as rotas seguem o padrao
 * /api/<recurso> e retornam ApiResponse<T>.
 */
function crud(resource) {
    const path = `/api/${resource}`;
    return {
        async list() {
            try {
                return unwrap(await api.get(path));
            } catch (error) {
                throw extractError(error);
            }
        },
        async get(id) {
            try {
                return unwrap(await api.get(`${path}/${id}`));
            } catch (error) {
                throw extractError(error);
            }
        },
        async create(entity) {
            try {
                return unwrap(await api.post(path, entity));
            } catch (error) {
                throw extractError(error);
            }
        },
        async update(id, entity) {
            try {
                return unwrap(await api.put(`${path}/${id}`, entity));
            } catch (error) {
                throw extractError(error);
            }
        },
        async remove(id) {
            try {
                return unwrap(await api.delete(`${path}/${id}`));
            } catch (error) {
                throw extractError(error);
            }
        },
        // Liquida um registro preenchendo a data de liquidacao informada.
        // Aplicavel a /api/transacoes/{id}/liquidacao; o back-end usa optimistic
        // locking e responde 409 quando ha alteracao concorrente (mensagem
        // propagada por extractError).
        async liquidar(id, dataLiquidacao) {
            try {
                return unwrap(await api.post(`${path}/${id}/liquidacao`, { dataLiquidacao }));
            } catch (error) {
                throw extractError(error);
            }
        },
    };
}

const recebiveisApi = {
    // --- Autenticacao ---------------------------------------------------------
    // A rota de login retorna AuthResponse diretamente (sem envelope ApiResponse).
    async login(nome, senha) {
        try {
            const { data } = await api.post('/api/auth/login', { nome, senha });
            return data; // { token, message, remainingAttempts }
        } catch (error) {
            throw extractError(error);
        }
    },

    // --- CRUD das entidades ---------------------------------------------------
    funcaos: crud('funcaos'),
    usuarios: crud('usuarios'),
    cedentes: crud('cedentes'),
    moedas: crud('moedas'),
    tiposRecebiveis: crud('tipos-recebiveis'),
    taxasCambio: crud('taxas-cambio'),
    recebiveis: crud('recebiveis'),
    transacoes: crud('transacoes'),

    // Acesso ao CRUD por nome de recurso (usado pelo CrudPage generico).
    resource(name) {
        return crud(name);
    },

    // --- Precificacao ---------------------------------------------------------
    async precificar(request) {
        try {
            return unwrap(await api.post('/api/precificacao', request));
        } catch (error) {
            throw extractError(error);
        }
    },

    // --- Relatorio de Extrato de Liquidacao -----------------------------------
    async extratoLiquidacao(filtro) {
        try {
            return unwrap(await api.get('/api/relatorios/extrato-liquidacao', { params: filtro }));
        } catch (error) {
            throw extractError(error);
        }
    },
};

export default recebiveisApi;
