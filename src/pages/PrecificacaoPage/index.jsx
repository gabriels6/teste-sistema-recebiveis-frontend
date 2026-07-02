import { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import { MessageHolder } from '../../components';
import recebiveisApi from '../../utils/api';

const EMPTY_FORM = {
    tipoRecebivel: '',
    valorFace: '',
    taxaBase: '',
    prazoMeses: '',
    moedaRecebivel: '',
    moeda: '',
    dataCambio: '',
};

/** Tela de precificacao: envia os parametros e exibe o valor presente calculado. */
const PrecificacaoPage = () => {
    const appContext = useContext(AppContext);
    const [form, setForm] = useState(EMPTY_FORM);
    const [resultado, setResultado] = useState(null);

    function handleChange(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        appContext.clearMessages();
        const request = {
            tipoRecebivel: form.tipoRecebivel || null,
            valorFace: form.valorFace === '' ? null : Number(form.valorFace),
            taxaBase: form.taxaBase === '' ? null : Number(form.taxaBase),
            prazoMeses: form.prazoMeses === '' ? null : Number(form.prazoMeses),
            moedaRecebivel: form.moedaRecebivel || null,
            moeda: form.moeda || null,
            dataCambio: form.dataCambio || null,
        };

        recebiveisApi
            .precificar(request)
            .then((data) => {
                setResultado(data);
                appContext.handleSuccess('Recebivel precificado com sucesso.');
            })
            .catch((error) => {
                setResultado(null);
                appContext.handleError(error);
            });
    }

    return (
        <div className="page">
            <div className="page-title">Precificacao de Recebivel</div>
            <MessageHolder />

            <div className="card-panel">
                <h2>Parametros</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group controlId="prec-tipo">
                                <Form.Label>Tipo de Recebivel</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex.: Duplicata Mercantil"
                                    value={form.tipoRecebivel}
                                    onChange={(e) => handleChange('tipoRecebivel', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="prec-valor-face">
                                <Form.Label>Valor de Face</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    value={form.valorFace}
                                    onChange={(e) => handleChange('valorFace', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="prec-taxa-base">
                                <Form.Label>Taxa Base (mensal, decimal)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    placeholder="Ex.: 0.01 para 1% a.m."
                                    value={form.taxaBase}
                                    onChange={(e) => handleChange('taxaBase', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="prec-prazo">
                                <Form.Label>Prazo (meses)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={form.prazoMeses}
                                    onChange={(e) => handleChange('prazoMeses', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="prec-moeda-receb">
                                <Form.Label>Moeda do Recebivel</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex.: BRL"
                                    value={form.moedaRecebivel}
                                    onChange={(e) => handleChange('moedaRecebivel', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="prec-moeda-alvo">
                                <Form.Label>Moeda Alvo (opcional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex.: USD"
                                    value={form.moeda}
                                    onChange={(e) => handleChange('moeda', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="prec-data-cambio">
                                <Form.Label>Data do Cambio (opcional)</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={form.dataCambio}
                                    onChange={(e) => handleChange('dataCambio', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            Precificar
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                setForm(EMPTY_FORM);
                                setResultado(null);
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </Form>
            </div>

            {resultado ? (
                <div className="card-panel">
                    <h2>Resultado</h2>
                    <div className="table-wrapper">
                        <Table bordered hover responsive>
                            <tbody>
                                <tr>
                                    <th>Tipo de Recebivel</th>
                                    <td>{resultado.tipoRecebivel}</td>
                                </tr>
                                <tr>
                                    <th>Valor de Face</th>
                                    <td>{resultado.valorFace}</td>
                                </tr>
                                <tr>
                                    <th>Taxa Base</th>
                                    <td>{resultado.taxaBase}</td>
                                </tr>
                                <tr>
                                    <th>Spread</th>
                                    <td>{resultado.spread}</td>
                                </tr>
                                <tr>
                                    <th>Prazo (meses)</th>
                                    <td>{resultado.prazoMeses}</td>
                                </tr>
                                <tr>
                                    <th>Valor Presente</th>
                                    <td>
                                        <strong>{resultado.valorPresente}</strong>{' '}
                                        {resultado.moeda || ''}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Taxa de Cambio Aplicada</th>
                                    <td>{resultado.taxaCambio}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default PrecificacaoPage;
