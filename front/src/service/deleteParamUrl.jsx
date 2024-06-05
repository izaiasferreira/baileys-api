
export default function deleteParam(id) {
    const searchParams3 = new URLSearchParams(window.location.search);
    searchParams3.delete(id);
    const newUrl2 = `${window.location.pathname}?${searchParams3.toString()}`;
    window.history.pushState({}, '', newUrl2);
}