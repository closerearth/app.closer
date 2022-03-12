import react, { useState } from 'react';

import PriceEditor from './PriceEditor';

const DiscountsEditor = ({ value, onChange, placeholder, required }) => {
  const [options, setOptions] = useState(value);
  const updateOptions = (update) => {
    setOptions(update);
    onChange && onChange(update);
  }
  const updateOption = (index, option) => {
    const update = options.map((o, i) => i === index ? option : o);
    updateOptions(update);
  }
  const addOption = e => {
    e.preventDefault();
    updateOptions(options.concat({
      id: Math.random(),
      name: '',
      code: '',
      percent: null,
      val: null
    }));
  };
  const removeOption = (e, index) => {
    e.preventDefault();
    updateOptions(options.filter((o, i) => index !== i))
  }

  return (
    <div className="discounts-options flex justify-start items-center flex-wrap">
      {
        options && options.map((option, index) => (
          <div key={ option._id || option.id || index } className="mr-3 mb-4 card">
            <div className="mb-3">
              <label>Code</label>
              <input
                type="text"
                value={ option.code }
                placeholder="SPECIAL_PRICE_50"
                onChange={e => { e.preventDefault(); updateOption(index, { ...option, code: e.target.value }); }}
              />
            </div>
            <div className="mb-3">
              <label>Ticket Name (optional)</label>
              <p className="italic text-gray-500 text-xs">If set, the discount code will only apply for specific ticket</p>
              <input
                type="text"
                value={ option.name }
                placeholder="Regular Ticket"
                onChange={e => { e.preventDefault(); updateOption(index, { ...option, name: e.target.value }); }}
              />
            </div>
            <div className="mb-3">
              <label>Percent discount</label>
              <input
                type="Number"
                min="0"
                max="100"
                step="1"
                className="w-32"
                value={ option.percent && option.percent * 100 }
                placeholder="24%"
                onChange={e => { e.preventDefault(); updateOption(index, { ...option, percent: e.target.value / 100 }); }}
              />
            </div>
            <div className="mb-3">
              <label>Nominal discount</label>
              <input
                type="Number"
                min="0"
                max="100000"
                step="1"
                className="w-32"
                value={ option.val }
                placeholder="24$"
                onChange={e => { e.preventDefault(); updateOption(index, { ...option, val: e.target.value }); }}
              />
            </div>
            <div className="mt-3">
              <a href="#" className="danger-link" onClick={ e => removeOption(e, index) }>remove</a>
            </div>
          </div>
        ))
      }
      <div className="flex justify-center items-center">
        <a href="#" className="btn" onClick={ e => addOption(e) }>Add discount code</a>
      </div>
    </div>
  );
}

DiscountsEditor.defaultProps = {
  onChange: null,
  value: []
}

export default DiscountsEditor;
