import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Message from '../Message';
import './styles.css';

/**
 * Renderiza a fila de mensagens de feedback do contexto. Clicar em uma mensagem
 * a remove da lista.
 */
const MessageHolder = () => {
    const appContext = useContext(AppContext);

    function removeMessage(index) {
        appContext.setMessages(appContext.messages.filter((_, i) => i !== index));
    }

    if (!appContext.messages.length) {
        return null;
    }

    return (
        <div className="message-holder">
            {appContext.messages.map((message, index) => (
                <Message
                    key={index}
                    type={message.type}
                    value={message.value}
                    onClick={() => removeMessage(index)}
                />
            ))}
        </div>
    );
};

export default MessageHolder;
