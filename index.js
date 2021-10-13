// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const randomBytes = require('crypto').randomBytes;
const stripe = require('stripe')('sk_test_51JjocdDQkELcVjKd6ERbHJLHnnLnZe6eKSFJYovfJF7UpSzRybYkIPrTv22EG4byEBZAhkLTteqLhqURGLb8wGv000rb3kE2AK');

exports.handler = async (event, context, callback) => {
    
    // const orderId = toUrlString(randomBytes(16));
    
    console.log('Hello! askjhdakslh Received event: ', event);

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);
    
    // const prices = await stripe.prices.list({
    //   lookup_keys: ["WildRydesPremium"],
    //   expand: ['data.product'],
    // });
    
    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card',
      'ideal'
    ],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Unicorn ride',
          },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://www.dogfoodidea.com/success',
    cancel_url: 'https://www.dogfoodidea.com/',
  });
  
  console.log(session);

  callback(null, {
      statusCode: 201,
      body: JSON.stringify(session),
      headers: {
          'Access-Control-Allow-Origin': '*',
      },
  });
};

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, requestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: requestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
