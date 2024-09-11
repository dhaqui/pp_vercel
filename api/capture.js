const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定
const environment = new paypal.core.SandboxEnvironment(
  'AV3P5knBPhPGwS7EDayvKulircVel0n9adwODe6qRp1-0vp2pZ2DRaOa0kegvAwQYlJ4K_C78v3RduCG',
  'EATQXaVnsOagF0rvsfzZwaSmk_040HeX1t2aOrLjOOjx2LlCGVCjdJwaQUJ_9rCpI4vYCFDaM2sn3fPb'
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = async (req, res) => {
  const { orderId } = req.query;

  try {
    // CAPTUREリクエストの送信
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await client.execute(request);

    // 決済のステータスを返す
    res.status(200).json({ status: capture.result.status });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ error: 'An error occurred while capturing the payment' });
  }
};
