const p = new Promise((resolve, reject) => {
    // Kick off some async work like access database, call a web service, start a timer
    setTimeout(() => {
        resolve(1); // pending => resolved, fulfilled state
        reject(new Error('message')); // pending => rejected
    }, 2000)
      // 1 is the result of async operation
    // reject(new Error('message'));
});

p.then(result => console.log('Result', result))
    .catch(err => console.log('Error', err.message));
