import * as d3 from "d3";

//----------- PROTOTYEPE FUNCTIONS  ----------------------

d3.selection.prototype.removeAll = function (selector) {
  return this.selectAll(selector).remove(), this;
};

d3.selection.prototype.element = function (params) {
  return params.tag
    ? this.append(params.tag).attr("class", params.class).attr("id", params.id)
    : this;
};

d3.selection.prototype.bindData = function (data, tag, aClass) {
  return this.selectAll("." + tag)
    .data(data)
    .enter()
    .element({ tag: tag, class: aClass });
};

d3.selection.prototype.disabled = function (bool) {
  return this.attr("disabled", bool ? true : null);
};

d3.selection.prototype.checked = function (bool) {
  return this.attr("checked", bool ? true : null);
};
