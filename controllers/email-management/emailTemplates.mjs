export const generateEmailTemplate = (name, itemsList, shippingAddress, orderTotal, email) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
        }
        .header {
            text-align: center;
            background-color: #0a74da;
            color: #ffffff;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 22px;
            color: #333333;
        }
        .order-summary {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .order-summary h3 {
            margin-top: 0;
            color: #333333;
        }
        .order-summary p {
            margin: 5px 0;
            color: #555555;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777777;
            background-color: #f4f4f4;
        }
        .footer a {
            color: #0a74da;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .button {
            display: inline-block;
            background-color: #0a74da;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Thank You for Your Order!</h1>
        </div>

        <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for shopping with us! We are excited to let you know that we’ve received your order and it’s now being processed. Below are the details of your order:</p>

            <div class="order-summary">
                <h3>Order Summary</h3>
                <p><strong>Items Ordered:</strong></p>
                <ul>
                    ${itemsList.map(item => `<li>${item.productId.name} - ${item.quantity} x ${item.price}</li>`).join('')}
                </ul>
                <p><strong>Sizes</strong></p>

                <ul>
                    ${itemsList.map(item => `<li>${item.productId.name} - ${item.size}</li>`).join('')}
                </ul>
                <p><strong>Colors</strong></p>
                <ul>
                    ${itemsList.map(item => `<li>${item.productId.name} - ${item.color}</li>`).join('')}
                </ul>
                <p><strong>Shipping Address:</strong></p>
                <p>${shippingAddress.country}, ${shippingAddress.city}, ${shippingAddress.address}</p>
                <p><strong>Total Amount:</strong> ${orderTotal}</p>
            </div>

            <p>We will notify you once your order has been shipped. You can track your order status through our website by logging into your account.</p>
            <p>If you have any questions or need further assistance, feel free to reply to this email or contact our customer support team at <a href="mailto:${email}">${email}</a>.</p>

            <a href=${process.env.FRONTEND} class="button">Visit Our Store</a>
        </div>

        <div class="footer">
            <p>Thank you again for choosing Apiduct. We look forward to serving you!</p>
            <p><a href=${process.env.FRONTEND}>${process.env.FRONTEND}</a> | <a href="mailto:${email}">${email}</a></p>
        </div>
    </div>
</body>
</html>
`;
