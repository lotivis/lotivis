// Strings

function str(src) {
    return "" + src;
}

export function prefix(src, pre) {
    return (src = str(src)), src.startsWith(pre || "") ? src : pre + src;
}

export function postfix(src, post) {
    return (src = str(src)), src.endsWith(post || "") ? src : src + post;
}

export function cut(src, max) {
    return ((src = str(src)), src.length <= max)
        ? src
        : postfix(src.substring(0, max), "...");
}

// D3 attributes

export function transX(x) {
    return "translate(" + x + ",0)";
}

export function transY(y) {
    return "translate(0," + y + ")";
}
