import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import MessageHolder from '../MessageHolder';
import recebiveisApi from '../../utils/api';
import './styles.css';

/** Monta o estado inicial (vazio) do formulario a partir dos campos configurados. */
function buildEmptyForm(fields) {
    const form = {};
    fields.forEach((field) => {
        form[field.key] = field.default != null ? field.default : '';
    });
    return form;
}

/** Converte o valor exibido de uma celula (trata referencias e valores nulos). */
function renderCell(field, item) {
    const value = item[field.key];
    if (field.type === 'ref') {
        return value ? field.optionLabel(value) : '-';
    }
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    return String(value);
}

/**
 * Tela de CRUD generica, dirigida pela configuracao da entidade (config/entities).
 * Faz listagem, criacao, edicao e remocao, carregando automaticamente as opcoes
 * dos campos do tipo referencia.
 */
const CrudPage = ({ entity }) => {
    const appContext = useContext(AppContext);

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(buildEmptyForm(entity.fields));
    const [editingId, setEditingId] = useState(null);
    const [refOptions, setRefOptions] = useState({});

    const api = recebiveisApi.resource(entity.resource);

    const loadItems = useCallback(() => {
        api
            .list()
            .then((data) => setItems(data || []))
            .catch((error) => appContext.handleError(error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity.resource]);

    // Carrega a lista e as opcoes de cada campo de referencia ao trocar de entidade.
    useEffect(() => {
        setForm(buildEmptyForm(entity.fields));
        setEditingId(null);
        loadItems();

        const refFields = entity.fields.filter((field) => field.type === 'ref');
        Promise.all(
            refFields.map((field) =>
                recebiveisApi
                    .resource(field.refResource)
                    .list()
                    .then((data) => [field.key, data || []])
                    .catch(() => [field.key, []])
            )
        ).then((entries) => setRefOptions(Object.fromEntries(entries)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity.resource]);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field.key]: value }));
    }

    /** Constroi o payload enviado a API (referencias viram objetos aninhados { id }). */
    function buildPayload() {
        const payload = {};
        if (editingId != null) {
            payload.id = editingId;
        }
        entity.fields.forEach((field) => {
            const raw = form[field.key];
            if (field.type === 'ref') {
                payload[field.key] = raw ? { id: Number(raw) } : null;
            } else if (field.type === 'number') {
                payload[field.key] = raw === '' || raw === null ? null : Number(raw);
            } else {
                payload[field.key] = raw === '' ? (field.optional ? null : '') : raw;
            }
        });
        return payload;
    }

    function resetForm() {
        setForm(buildEmptyForm(entity.fields));
        setEditingId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const payload = buildPayload();
        const request = editingId != null ? api.update(editingId, payload) : api.create(payload);

        request
            .then(() => {
                appContext.handleSuccess(
                    editingId != null
                        ? `${entity.title}: registro atualizado com sucesso.`
                        : `${entity.title}: registro criado com sucesso.`
                );
                resetForm();
                loadItems();
            })
            .catch((error) => appContext.handleError(error));
    }

    function handleEdit(item) {
        const nextForm = {};
        entity.fields.forEach((field) => {
            if (field.type === 'ref') {
                nextForm[field.key] = item[field.key]?.id ?? '';
            } else {
                nextForm[field.key] = item[field.key] ?? '';
            }
        });
        setForm(nextForm);
        setEditingId(item.id);
        appContext.clearMessages();
    }

    function handleDelete(item) {
        if (!window.confirm(`Remover este registro de ${entity.title}?`)) {
            return;
        }
        api
            .remove(item.id)
            .then(() => {
                appContext.handleSuccess(`${entity.title}: registro removido com sucesso.`);
                if (editingId === item.id) {
                    resetForm();
                }
                loadItems();
            })
            .catch((error) => appContext.handleError(error));
    }

    return (
        <div className="page">
            <div className="page-title">{entity.title}</div>
            <MessageHolder />

            <div className="card-panel">
                <h2>{editingId != null ? 'Editar registro' : 'Novo registro'}</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="crud-form-grid">
                        {entity.fields.map((field) => (
                            <Form.Group key={field.key} controlId={`field-${field.key}`}>
                                <Form.Label>{field.label}</Form.Label>
                                {field.type === 'ref' ? (
                                    <Form.Select
                                        value={form[field.key]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        {(refOptions[field.key] || []).map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {field.optionLabel(option)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type={field.type === 'number' ? 'number' : field.type}
                                        step={field.type === 'number' ? 'any' : undefined}
                                        value={form[field.key]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                    />
                                )}
                            </Form.Group>
                        ))}
                    </div>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            {editingId != null ? 'Salvar alteracoes' : 'Criar'}
                        </Button>
                        {editingId != null ? (
                            <Button variant="outline-secondary" onClick={resetForm}>
                                Cancelar
                            </Button>
                        ) : null}
                        <Button variant="outline-secondary" onClick={loadItems}>
                            Recarregar
                        </Button>
                    </div>
                </Form>
            </div>

            <div className="card-panel">
                <h2>Registros cadastrados</h2>
                <div className="table-wrapper">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {entity.fields.map((field) => (
                                    <th key={field.key}>{field.label}</th>
                                ))}
                                <th>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={entity.fields.length + 2} className="crud-empty">
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        {entity.fields.map((field) => (
                                            <td key={field.key}>{renderCell(field, item)}</td>
                                        ))}
                                        <td className="crud-actions">
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDelete(item)}
                                            >
                                                Remover
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default CrudPage;
