/**
 * Returns the style of the given CSS class or an empty object.
 *
 * @param className The CSS class name.
 * @returns {{}} The CSS style.
 */
export function styleForCSSClass(className) {
  let selector = className;
  if (!selector.startsWith(".")) selector = "." + selector;
  let element = document.querySelector(selector);
  if (!element) return {};
  let style = getComputedStyle(element);
  return style ? style : {};
}
