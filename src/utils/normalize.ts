export function normalize(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').split(" ").join("_").toLowerCase();
}