import React from 'react';
import PropTypes from 'prop-types';
import PaypalExpressBtn from 'react-paypal-express-checkout';

const PayPalCheckout = ({ total, onSuccess }) => {
  const client = {
    sandbox: 'AQr0aPcvsJ0PVPRU-V3wnaF69ZMVeXf07i8Dm4CQe7tTRPKM9U_G9E3pVrbEIGq2VKMLzErA-Qt6OftR',
    production: 'AVa7CsXTanTrnHG-It8CCzQ5LhqeOGJbeX7SV1jSKxoDAO34vUZ30LaDuMZ7p7spIaTfgXxN3Hxy2ojs3'
  };

  return (
    <PaypalExpressBtn
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