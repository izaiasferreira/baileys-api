
import { getLocalStorage, setLocalStorage } from './axios';
export default function setTitleAndFavicon(callback) {
    var localStorage = getLocalStorage('theme-catbot')
    var root = document.getElementById('root')
    if (REACT_APP_BRAND === 'FLOWTALK' && localStorage?.theme === 'root-flowtalk') {
        root.className = `root-flowtalk`
    }
    if (REACT_APP_BRAND === 'FLOWTALK' && localStorage?.theme === 'root-dark-flowtalk') {
        root.className = `root-dark-flowtalk`
    }
    if (REACT_APP_BRAND === 'FLOWTALK') {
        var icon = document.getElementById('icon')
        icon.setAttribute('href', './img/simbol-default-flowtalk.png')
        var title = document.getElementById('title')
        title.innerHTML = 'Flowtalk'
    } else {
        var icon = document.getElementById('icon')
        icon.setAttribute('href', './img/simbol-default.png')
        var title = document.getElementById('title')
        title.innerHTML = 'Cattalk'
    }
    if (localStorage) {

        if (REACT_APP_BRAND === 'FLOWTALK' && localStorage.theme === 'root') {
            root.className = `root-flowtalk`
        }
        else if (REACT_APP_BRAND === 'FLOWTALK' && localStorage.theme === 'root-dark') {
            root.className = `root-dark-flowtalk`
        }
        else if (!REACT_APP_BRAND !== 'FLOWTALK' && localStorage.theme === 'root') {
            root.className = `root`
        }
        else if (REACT_APP_BRAND !== 'FLOWTALK' && localStorage.theme === 'root-dark') {
            root.className = `root-dark`
        }

        if (callback) localStorage.theme === 'root' || localStorage.theme === 'root-flowtalk' ? callback(true) : callback(false)
    } else {
        root.className = REACT_APP_BRAND === 'FLOWTALK' ? 'root-flowtalk' : 'root'
        setLocalStorage({ theme: REACT_APP_BRAND === 'FLOWTALK' ? 'root-flowtalk' : 'root' }, 'theme-catbot')
        if (callback) callback(true)
    }
}