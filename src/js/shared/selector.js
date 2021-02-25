/**
 *
 */
export var createID;
(function() {
  let uniquePrevious = 0;
  createID = function() {
    return 'id-' + uniquePrevious++;
  };
}());
