const MessageLayout = ({ name, body, sentByMe, i }) => {
    const messageContent = <div className='message-content' key={`C_${name}_${i}`}>{body}</div>;
    const messageSender = <div className='sender' key={`S_${name}_${i}`}>{name}</div>;
    const layout = sentByMe
        ? 'sent-by-me'
        : 'sent-by-other';
    let result = sentByMe
        ? [messageContent, messageSender]
        : [messageSender, messageContent];
    return (<div className={`message-wrapper ${layout}`} key={`m_${name}_${i}`}>{result}</div>)
};

export default MessageLayout;
