import React from 'react';
import PropTypes from 'prop-types';
import PaypalExpressBtn from 'react-paypal-express-checkout';

import { paypal } from '../config.json';

const PayPalCheckout = ({ total, onSuccess }) => {
  const client = {
    sandbox: paypal.sandbox,
    production: paypal.production
  };

  return (
    <PaypalExpressBtn
      // env={paypal.env}
      client={client}
      currency={'GBP'}
      total={total}
      onSuccess={onSuccess}
      style={{ size: 'responsive', tagline: false }}
    />
  );
};

PayPalCheckout.propTypes = {
  total: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default PayPalCheckout;