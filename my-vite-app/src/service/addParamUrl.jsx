
export default function addParam(param, value) {
    const searchParams2 = new URLSearchParams(window.location.search);
    searchParams2.set(param, value);
    const newUrl = `${window.location.pathname}?${searchParams2.toString()}`;
    window.history.pushState({}, '', newUrl);
}