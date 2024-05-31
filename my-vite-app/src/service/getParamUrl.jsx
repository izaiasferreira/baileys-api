
export default function getParam(param) {
    const searchParams = new URLSearchParams(window.location.search);
    const paramValue = searchParams.get(param);
    return paramValue
}