export function screenshotElement(selector, name) {
    console.log('selector: ' + selector);
    let element = document.querySelector(selector);
    console.log('element: ' + element);
    html2canvas(element).then(canvas => {
        const link = document.createElement("a");
        link.setAttribute('download', name || "name");
        link.href = canvas.toDataURL("image/jpg");
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}