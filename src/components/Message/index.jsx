import './styles.css';

/** Uma unica mensagem de feedback (sucesso, erro ou aviso). */
const Message = ({ type = 'warning', value, onClick }) => (
    <div className={`message message-${type}`} onClick={onClick} role="alert">
        {value}
    </div>
);

export default Message;
