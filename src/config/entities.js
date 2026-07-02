/**
 * Configuracao declarativa das entidades expostas pelo CRUD generico (CrudPage).
 *
 * Cada entidade define:
 *  - resource: sufixo da rota REST (/api/<resource>)
 *  - title:    titulo exibido na tela
 *  - fields:   lista de campos do formulario/tabela
 *
 * Tipos de campo suportados:
 *  - text    : texto simples
 *  - number  : numerico (BigDecimal/Integer)
 *  - date    : data (YYYY-MM-DD)
 *  - ref      : referencia a outra entidade; renderiza um <select> populado por
 *              `refResource` e envia { id } no payload (objeto aninhado do back-end).
 *
 * Campos ref possuem `optionLabel(item)` para montar o texto de cada opcao.
 */

export const CURRENCY_LABEL = (m) => (m ? m.codMoeda : '');

const ENTITIES = {
    funcaos: {
        resource: 'funcaos',
        title: 'Funcoes',
        fields: [
            { key: 'nome', label: 'Nome', type: 'text' },
        ],
    },

    'tipos-recebiveis': {
        resource: 'tipos-recebiveis',
        title: 'Tipos de Recebivel',
        fields: [
            { key: 'nome', label: 'Nome', type: 'text' },
        ],
    },

    moedas: {
        resource: 'moedas',
        title: 'Moedas',
        fields: [
            { key: 'codMoeda', label: 'Codigo da Moeda', type: 'text' },
        ],
    },

    cedentes: {
        resource: 'cedentes',
        title: 'Cedentes',
        fields: [
            { key: 'codEmpresa', label: 'Codigo da Empresa', type: 'text' },
            { key: 'nome', label: 'Nome', type: 'text' },
        ],
    },

    usuarios: {
        resource: 'usuarios',
        title: 'Usuarios',
        fields: [
            { key: 'nome', label: 'Nome', type: 'text' },
            { key: 'hashSenha', label: 'Senha (hash)', type: 'text' },
            { key: 'tentativas', label: 'Tentativas', type: 'number', default: 0 },
            {
                key: 'funcao',
                label: 'Funcao',
                type: 'ref',
                refResource: 'funcaos',
                optionLabel: (f) => f.nome,
            },
        ],
    },

    'taxas-cambio': {
        resource: 'taxas-cambio',
        title: 'Taxas de Cambio',
        fields: [
            {
                key: 'moedaOrigem',
                label: 'Moeda Origem',
                type: 'ref',
                refResource: 'moedas',
                optionLabel: CURRENCY_LABEL,
            },
            {
                key: 'moedaDestino',
                label: 'Moeda Destino',
                type: 'ref',
                refResource: 'moedas',
                optionLabel: CURRENCY_LABEL,
            },
            { key: 'dataReferencia', label: 'Data de Referencia', type: 'date' },
            { key: 'valor', label: 'Valor', type: 'number' },
        ],
    },

    recebiveis: {
        resource: 'recebiveis',
        title: 'Recebiveis',
        fields: [
            { key: 'codAtivo', label: 'Codigo do Ativo', type: 'text' },
            { key: 'dataVencimento', label: 'Data de Vencimento', type: 'date' },
            { key: 'taxaBase', label: 'Taxa Base', type: 'number' },
            {
                key: 'moeda',
                label: 'Moeda',
                type: 'ref',
                refResource: 'moedas',
                optionLabel: CURRENCY_LABEL,
            },
            {
                key: 'cedente',
                label: 'Cedente',
                type: 'ref',
                refResource: 'cedentes',
                optionLabel: (c) => `${c.nome} (${c.codEmpresa})`,
            },
            {
                key: 'tipoRecebivel',
                label: 'Tipo de Recebivel',
                type: 'ref',
                refResource: 'tipos-recebiveis',
                optionLabel: (t) => t.nome,
            },
        ],
    },

    transacoes: {
        resource: 'transacoes',
        title: 'Transacoes',
        fields: [
            { key: 'dataOperacao', label: 'Data de Operacao', type: 'date' },
            { key: 'dataLiquidacao', label: 'Data de Liquidacao', type: 'date', optional: true },
            { key: 'qtdeOperacao', label: 'Quantidade da Operacao', type: 'number' },
            {
                key: 'usuario',
                label: 'Usuario',
                type: 'ref',
                refResource: 'usuarios',
                optionLabel: (u) => u.nome,
            },
            {
                key: 'recebivel',
                label: 'Recebivel',
                type: 'ref',
                refResource: 'recebiveis',
                optionLabel: (r) => r.codAtivo,
            },
            {
                key: 'moeda',
                label: 'Moeda',
                type: 'ref',
                refResource: 'moedas',
                optionLabel: CURRENCY_LABEL,
            },
        ],
    },
};

export default ENTITIES;
