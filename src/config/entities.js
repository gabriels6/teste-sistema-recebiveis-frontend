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
 *
 * Campos podem ainda declarar:
 *  - computed: true : campo somente-leitura (exibido na tabela, fora do formulario
 *                     e do payload); usado para valores calculados pelo back-end.
 *  - format(value)  : formata o valor exibido na celula da tabela.
 *
 * Acoes customizadas (opcional): `actions` lista botoes extras por registro na
 * coluna "Acoes". Cada acao define:
 *  - key/label/variant : identificacao e estilo do botao
 *  - isAvailable(item)  : (opcional) exibe o botao apenas quando retorna true
 *  - fields             : (opcional) campos coletados num modal antes de executar
 *  - run(api, item, values) : executa a acao (recebe o CRUD da entidade)
 *  - successMessage     : mensagem exibida ao concluir
 *
 * Acoes de formulario (opcional): `formActions` lista botoes ao lado de Salvar.
 * Cada acao define:
 *  - key/label/variant : identificacao e estilo do botao
 *  - requiredFields    : chaves que precisam estar preenchidas para habilitar
 *  - run(api, payload) : executa a acao com o payload atual do formulario
 *  - message(result)   : mensagem exibida com o resultado
 */

export const CURRENCY_LABEL = (m) => (m ? m.codMoeda : '');

/** Data de hoje no formato YYYY-MM-DD (usada como default da liquidacao). */
const hoje = () => new Date().toISOString().slice(0, 10);

/** Formata um desagio (razao decimal) como percentual, ex.: 0.05 -> "5.0000%". */
const formatDesagio = (v) => (v == null || v === '' ? '-' : `${(Number(v) * 100).toFixed(4)}%`);

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
            // Exibida na tabela, mas fora do formulario: a liquidacao e feita pela
            // acao "Liquidar" (formHidden preserva o valor no payload ao editar).
            { key: 'dataLiquidacao', label: 'Data de Liquidacao', type: 'date', optional: true, formHidden: true },
            { key: 'qtdeOperacao', label: 'Quantidade da Operacao', type: 'number' },
            { key: 'precoUnitario', label: 'Preco Unitario', type: 'number' },
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
            // Deságio calculado pelo back-end (valor presente / preço unitário - 1).
            { key: 'desagio', label: 'Desagio', type: 'number', computed: true, format: formatDesagio },
        ],
        formActions: [
            {
                key: 'calcular-desagio',
                label: 'Calcular Desagio',
                variant: 'outline-info',
                // Habilita quando os campos necessarios ao calculo estao preenchidos.
                requiredFields: ['dataOperacao', 'qtdeOperacao', 'precoUnitario', 'recebivel', 'moeda'],
                run: (api, payload) => api.calcularDesagio(payload),
                message: (r) =>
                    `Desagio: ${formatDesagio(r.desagio)} (valor presente ${r.valorPresente} ${r.moeda || ''}).`,
            },
        ],
        actions: [
            {
                key: 'liquidar',
                label: 'Liquidar',
                variant: 'outline-success',
                // So oferece a liquidacao para transacoes ainda nao liquidadas.
                isAvailable: (item) => !item.dataLiquidacao,
                // Coleta a data de liquidacao (default: hoje) antes de executar.
                fields: [
                    { key: 'dataLiquidacao', label: 'Data de Liquidacao', type: 'date', default: hoje },
                ],
                run: (api, item, values) => api.liquidar(item.id, values.dataLiquidacao),
                successMessage: 'Transacao liquidada com sucesso.',
            },
        ],
    },
};

export default ENTITIES;
