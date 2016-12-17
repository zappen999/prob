# Prob
Error handling middleware for Koa 2

### Requirements
**Requires Node.js 7+ or Babel to support async/await**

### API
```js
Prob(severity: String, message: String, [meta: Object, [status = 500: Integer]])
```

### Example
```js
const prob = require('prob');
const Prob = prob.Prob;

// Setup error handler for application
prob.setHandler(function(ctx, prob) {
  // Log to application log
  console.log('A problem occured in the app:', prob);

  // Handle response to client
  ctx.status = prob.status || 500;
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    message: prob.message
  });
});

// Apply the middleware
router.use(prob.handle);

// Some route
router.post('/', async function(ctx, next) {
  try {
    dostuff();
  } catch (err) {
    throw new Prob('error', 'Could not do stuff', err, 500);
  }
});
```
