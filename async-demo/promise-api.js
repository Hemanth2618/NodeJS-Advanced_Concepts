
// Already resolved promise (Settled promise). It will be useful while writing unit tests
const p = Promise.resolve({id: 1});
p.then(result => console.log(result));

// Already rejected promise
const q = Promise.reject(new Error('reason for rejection...'));
q.catch(error => console.log(error));