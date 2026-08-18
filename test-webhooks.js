const http = require('http');

const testPayloads = [
  {
    partner: 'delhivery',
    payload: {
      waybill: 'NV-TEST-1',
      remittance_amount: 1500.0,
      utr_number: 'UTR-DEL-1'
    }
  },
  {
    partner: 'bluedart',
    payload: {
      AWBNo: 'NV-TEST-2',
      CODAmountCollected: 2500.5,
      ChequeUTRNo: 'UTR-BD-1'
    }
  },
  {
    partner: 'generic/fedex',
    payload: {
      orderId: 'NV-TEST-3',
      settledAmount: 3500.0,
      reference: 'UTR-FED-1'
    }
  }
];

async function runTests() {
  for (const test of testPayloads) {
    const data = JSON.stringify(test.payload);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/v1/webhooks/reconciliation/${test.partner}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`Response for ${test.partner} [${res.statusCode}]:`, body);
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`Error for ${test.partner}:`, e.message);
        resolve();
      });

      req.write(data);
      req.end();
    });
  }
}

runTests();
