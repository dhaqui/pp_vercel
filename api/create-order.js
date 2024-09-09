const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定（ここでclient_idとclient_secretを直接設定）
const environment = new paypal.core.SandboxEnvironment(
  'AV3P5knBPhPGwS7EDayvKulircVel0n9adwODe6qRp1-0vp2pZ2DRaOa0kegvAwQYlJ4K_C78v3RduCG', // あなたのclient_id
  'EATQXaVnsOagF0rvsfzZwaSmk_040HeX1t2aOrLjOOjx2LlCGVCjdJwaQUJ_9rCpI4vYCFDaM2sn3fPb' // あなたのclient_secret
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
            currency_code: 'JPY',
            value: 100
          }
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
