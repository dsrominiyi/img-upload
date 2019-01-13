import React from 'react';
import PropTypes from 'prop-types';
import PaypalExpressBtn from 'react-paypal-express-checkout';

const PayPalCheckout = ({ total, onSuccess }) => {
  const client = {
    sandbox: 'ARe3oQ2V5xc3q9oEUY-HzAcmJgkQQ3KYQqVNCMyBcpXv7PUdU5imbNbVzFuzTEGy_lv5c7qwn-WoBKjS',
    production: 'AVa7CsXTanTrnHG-It8CCzQ5LhqeOGJbeX7SV1jSKxoDAO34vUZ30LaDuMZ7p7spIaTfgXxN3Hxy2ojs3'
  };

  return (
    <PaypalExpressBtn
      client={client}
      currency={'GBP'}
      total={total}
      onSuccess={onSuccess}
    />
  );
};

PayPalCheckout.propTypes = {
  total: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default PayPalCheckout;