import ReactDOMServer from 'react-dom/server';
import getTypeMessage from './getTypeMessage'
import getTypeOnlyText from './getTypeOnlyText';
export default async function configureLastMessage(lastMessage, message) {
    // console.log('configureLastMessage');
    // if (lastMessage && message) {
    //     lastMessage.innerHTML = ''
    //     lastMessage.innerHTML = ReactDOMServer.renderToString(getTypeMessage(message))
    // }
    return getTypeOnlyText(message)
}