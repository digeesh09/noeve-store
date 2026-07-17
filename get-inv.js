const http = require('http');

const req = http.request('http://localhost:3001/v1/admin/inventory', {
  method: 'GET',
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.end();
