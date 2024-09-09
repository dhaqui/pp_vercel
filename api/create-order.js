const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定（ここでclient_idとclient_secretを直接設定）
const environment = new paypal.core.SandboxEnvironment(
  'AeNx2jnN5CUV4jAPLqYMat3ig6PDZXh-kKPnTjQQIIU6AVNA79QnRp-dk4tqHvnnqBbzR_WlCovKdMN-', // あなたのclient_id
  'EAMWkTh00y7VV_OF0rjxXvriOLYOCOINlwQLfwuif4HjSxSfOFcvI3TV5363vM1svOPqyX00HtlQIepu' // あなたのclient_secret
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { items } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    const totalAmount = items.reduce((total, item) => total + item.price, 0);

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2)
          },
          items: items.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: item.currency,
              value: item.price.toFixed(2)
            },
            quantity: '1'
          }))
        }
      ]
    });

    try {
      const order = await client.execute(request);
      res.status(200).json(order.result);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'An error occurred while creating the order' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
