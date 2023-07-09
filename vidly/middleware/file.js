const myModule = (function() {
  // Private variables and functions
  let privateVariable = 'Hello';

  function privateFunction() {
    console.log(privateVariable);
  }

  // Public API
  return {
    publicFunction: function() {
      privateFunction();
    }
  };
})();

myModule.publicFunction();// Output: Hello
console.log(myModule);
