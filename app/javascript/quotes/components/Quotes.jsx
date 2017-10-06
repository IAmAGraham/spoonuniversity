import React from 'react';

const Quotes = ({quote}) => (
  <div className='quote'>
    <div className='quote-open'>“</div>
    <div className='quote-close'>”</div>
    <div className='quote-text'>
      {quote.text}
    </div>
    <div className='quote-author'>
      <em>— {quote.author}</em>
    </div>
  </div>
)

export default Quotes
