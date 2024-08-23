import https from 'node:https'

export const payment = (req, res) => {
    const { email, amount } = req.body;
  
    const params = JSON.stringify({
      email,
      amount: amount * 100,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };
  
    const paystackReq = https.request(options, paystackRes => {
      let data = '';
  
      paystackRes.on('data', (chunk) => {
        data += chunk;
      });
  
      paystackRes.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          const { data: { access_code }} = parsedData
          res.json({ access_code });
        } catch (error) {
          res.status(500).json({ error: 'Failed to parse response from Paystack' });
        }
      });
    })

    paystackReq.write(params);
    paystackReq.end();
}
