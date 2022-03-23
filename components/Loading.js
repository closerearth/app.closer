import React, { useState } from 'react';
import { __ } from '../utils/helpers';

const Loading = () => (
  <div className="loading">
    <div className="lds-ripple"><div></div><div></div></div> { __('loading_message') }
  </div>
);

export default Loading;
