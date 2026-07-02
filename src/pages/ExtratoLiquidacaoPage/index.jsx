import { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import { MessageHolder } from '../../components';
import recebiveisApi from '../../utils/api';

const EMPTY_FILTER = {
    dataOperacaoInicio: '',
    dataOperacaoFim: '',
    dataLiquidacaoInicio: '',
    dataLiquidacaoFim: '',
    nomeCedente: '',
    moeda: '',
    tamanhoPagina: 20,
};

/** Remove campos vazios do filtro antes de enviar a API. */
function buildParams(filter, pagina) {
    const params = { pagina, tamanhoPagina: Number(filter.tamanhoPagina) || 20 };
    ['dataOperacaoInicio', 'dataOperacaoFim', 'dataLiquidacaoInicio', 'dataLiquidacaoFim', 'nomeCedente', 'moeda'].forEach(
        (key) => {
            if (filter[key]) {
                params[key] = filter[key];
            }
        }
    );
    return params;
}

/** Relatorio de Extrato de Liquidacao com filtros combinaveis e paginacao. */
const ExtratoLiquidacaoPage = () => {
    const appContext = useContext(AppContext);
    const [filter, setFilter] = useState(EMPTY_FILTER);
    const [pagina, setPagina] = useState(0);
    const [result, setResult] = useState(null);

    function handleChange(key, value) {
        setFilter((current) => ({ ...current, [key]: value }));
    }

    function fetchPage(targetPage) {
        appContext.clearMessages();
        recebiveisApi
            .extratoLiquidacao(buildParams(filter, targetPage))
            .then((data) => {
                setResult(data);
                setPagina(targetPage);
            })
            .catch((error) => {
                setResult(null);
                appContext.handleError(error);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetchPage(0);
    }

    const totalPaginas = result?.totalPaginas ?? 0;
    const items = result?.conteudo ?? [];

    return (
        <div className="page">
            <div className="page-title">Extrato de Liquidacao</div>
            <MessageHolder />

            <div className="card-panel">
                <h2>Filtros</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Group controlId="ext-op-inicio">
                                <Form.Label>Operacao - Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filter.dataOperacaoInicio}
                                    onChange={(e) => handleChange('dataOperacaoInicio', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="ext-op-fim">
                                <Form.Label>Operacao - Fim</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filter.dataOperacaoFim}
                                    onChange={(e) => handleChange('dataOperacaoFim', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="ext-liq-inicio">
                                <Form.Label>Liquidacao - Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filter.dataLiquidacaoInicio}
                                    onChange={(e) => handleChange('dataLiquidacaoInicio', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="ext-liq-fim">
                                <Form.Label>Liquidacao - Fim</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filter.dataLiquidacaoFim}
                                    onChange={(e) => handleChange('dataLiquidacaoFim', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="ext-cedente">
                                <Form.Label>Nome do Cedente</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Correspondencia parcial"
                                    value={filter.nomeCedente}
                                    onChange={(e) => handleChange('nomeCedente', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="ext-moeda">
                                <Form.Label>Moeda</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex.: BRL"
                                    value={filter.moeda}
                                    onChange={(e) => handleChange('moeda', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="ext-tamanho">
                                <Form.Label>Itens por pagina</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    value={filter.tamanhoPagina}
                                    onChange={(e) => handleChange('tamanhoPagina', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            Gerar relatorio
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                setFilter(EMPTY_FILTER);
                                setResult(null);
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </Form>
            </div>

            {result ? (
                <div className="card-panel">
                    <h2>
                        Resultados ({result.totalElementos} registro
                        {result.totalElementos === 1 ? '' : 's'})
                    </h2>
                    <div className="table-wrapper">
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Transacao</th>
                                    <th>Data Operacao</th>
                                    <th>Data Liquidacao</th>
                                    <th>Valor Face</th>
                                    <th>Moeda Op.</th>
                                    <th>Cod. Ativo</th>
                                    <th>Tipo Recebivel</th>
                                    <th>Taxa Base</th>
                                    <th>Spread</th>
                                    <th>Moeda Receb.</th>
                                    <th>Cedente</th>
                                    <th>Cod. Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} style={{ textAlign: 'center' }}>
                                            Nenhum registro encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.transacaoId}>
                                            <td>{item.transacaoId}</td>
                                            <td>{item.dataOperacao}</td>
                                            <td>{item.dataLiquidacao || '-'}</td>
                                            <td>{item.valorFace}</td>
                                            <td>{item.moedaOperacao}</td>
                                            <td>{item.codAtivo}</td>
                                            <td>{item.tipoRecebivel}</td>
                                            <td>{item.taxaBase}</td>
                                            <td>{item.spread ?? '-'}</td>
                                            <td>{item.moedaRecebivel}</td>
                                            <td>{item.cedenteNome}</td>
                                            <td>{item.cedenteCodEmpresa}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="form-actions" style={{ alignItems: 'center' }}>
                        <Button
                            variant="outline-primary"
                            disabled={pagina <= 0}
                            onClick={() => fetchPage(pagina - 1)}
                        >
                            Anterior
                        </Button>
                        <span>
                            Pagina {pagina + 1} de {Math.max(totalPaginas, 1)}
                        </span>
                        <Button
                            variant="outline-primary"
                            disabled={pagina + 1 >= totalPaginas}
                            onClick={() => fetchPage(pagina + 1)}
                        >
                            Proxima
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ExtratoLiquidacaoPage;
