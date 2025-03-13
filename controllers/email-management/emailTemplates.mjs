export const generateEmailTemplate = (name, email, listOfOrderId) => `
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
            <p>Thank you for shopping with us! We are excited to let you know that we’ve received your order and it’s now being processed.</p>
            <p>Your order number is: ${listOfOrderId.join(', ')}</p>
            <p>We will send you a confirmation email once your order has been shipped. You can track your order status through our website by using the tracking with your orderIds.</p>
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

export const generateSimpleSellerNotificationTemplate = () => `
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
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>New Order Received</h1>
        </div>

        <div class="content">
            <p>Hi there,</p>
            <p>You have received a new order! To view the details and start processing the order, please visit your admin dashboard.</p>

            <a href="${process.env.FRONTEND}/dashboard/admin" class="button">Go to Admin Dashboard</a>
        </div>

        <div class="footer">
            <p>Thank you for being a part of Apiduct!</p>
        </div>
    </div>
</body>
</html>
`;


export const SubscribeToNewsLetterTemplate = (unsubscribeLink) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Newsletter</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 10px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; text-align: center; }
        .content h1 { font-size: 24px; margin-bottom: 20px; }
        .content p { font-size: 16px; line-height: 1.5; color: #333333; }
        .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #888888; }
        .footer a { color: #007BFF; text-decoration: none; }
        p a { color: "blue"; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><img src="https://via.placeholder.com/150" alt="Company Logo"></div>
        <div class="content">
            <h1>Welcome to OverLow!</h1>
            <p>Hi there,</p>
            <p>Thank you for subscribing to our newsletter! We're excited to have you on board. You'll now be the first to hear about our latest updates, exclusive offers, and more.</p>
            <p>Stay tuned for our upcoming newsletters where we'll share insightful content, industry news, and special promotions just for you.</p>
            <a href="https://kariaki.vercel.app/" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>If you have any questions or need assistance, feel free to <a href=mailto:${process.env.ADDRESS}>contact us</a>.</p>
            <p>&copy; 2024 Overflow. All rights reserved.</p>
            <p><a href="${unsubscribeLink}">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
`;

export const generateDeliveredOrderReviewTemplate = (name, orderId) => `
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
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Your Order Has Been Delivered!</h1>
        </div>

        <div class="content">
            <p>Hi ${name},</p>
            <p>We're happy to inform you that your order (ID: ${orderId}) has been successfully delivered. We hope you are enjoying your purchase!</p>

            <p>We'd love to hear your feedback. Could you take a moment to leave us a review?</p>

            <a href="${process.env.FRONTEND}/review/${orderId}" class="button">Leave a Review</a>
        </div>

        <div class="footer">
            <p>Thank you for shopping with Apiduct!</p>
        </div>
    </div>
</body>
</html>
`;

export const trackEmailTemplate = (name, orderId, status) => `
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
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Order Status Update</h1>
        </div>

        <div class="content">
            <p>Hi ${name},</p>
            <p>We wanted to let you know that the status of your order (ID: ${orderId}) has been updated to: <strong>${status}</strong>.</p>

            <p>You can track your order and view additional details by clicking the button below:</p>

            <a href="${process.env.FRONTEND}/track-order/${orderId}" class="button">Track Your Order</a>
        </div>

        <div class="footer">
            <p>Thank you for shopping with Apiduct!</p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.ADDRESS}">${process.env.ADDRESS}</a>.</p>
        </div>
    </div>
</body>
</html>
`;

export const cancelEmailTemplate = (name, orderId) => `
...
`

// export const uploadNewProductEmailTemplate