export const convertUrlToStr = (url) => {
    let str = url.replace(/\/|https|http|\.|:/gi, "");
    return str;
}
