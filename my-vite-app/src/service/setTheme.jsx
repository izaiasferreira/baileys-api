
import { setLocalStorage } from './axios';
export default function setTheme(state, callback) {
    var root = document.getElementById('root')
    // console.log('aqui');
    if (REACT_APP_BRAND === 'FLOWTALK') {
        root.className === "root-flowtalk" ? root.className = 'root-dark-flowtalk' : root.className = 'root-flowtalk'
        setLocalStorage({ theme: root.className }, 'theme-catbot')
    } else {
        root.className === "root" ? root.className = 'root-dark' : root.className = 'root'
        // console.log( root.className);
        setLocalStorage({ theme: root.className }, 'theme-catbot')
    }
    if (callback) callback(!state)

}