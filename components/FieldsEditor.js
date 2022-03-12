import react, { useState } from 'react';

import PriceEditor from './PriceEditor';

const fieldTypes = [
  {
    value: 'text',
    label: 'Text'
  },
  {
    value: 'datetime',
    label: 'Date & Time'
  },
  {
    value: 'select',
    label: 'Multi select'
  },
];

const FieldsEditor = ({ value, onChange }) => {
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
      fieldType: 'text',
      options: []
    }));
  };
  const removeOption = (e, index) => {
    e.preventDefault();
    updateOptions(options.filter((o, i) => index !== i))
  }

  return (
    <div className="discounts-options">
      {
        options && options.map((option, index) => (
          <div key={ option._id || option.id || index } className="mr-3 mb-4 shadow">
            <div className="mb-3">
              <label>Question</label>
              <input
                type="text"
                value={ option.name }
                placeholder="What time will you arrive?"
                onChange={e => { e.preventDefault(); updateOption(index, { ...option, name: e.target.value }); }}
              />
            </div>
            <div className="mb-3">
              <label>Type</label>
              <select
                value={ option.fieldType }
                onChange={e => updateOption(index, { ...option, fieldType: e.target.value })}
              >
                {fieldTypes.map(opt => (
                  <option value={ opt.value } key={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            { option.fieldType === 'select' &&
              <div className="mb-3">
                <label>Options</label>
                { option.options && option.options.map((opt, i) => (
                  <div key={ i }>
                    <input
                      type="text"
                      value={ opt }
                      placeholder={`around ${3 + i}pm`}
                      onChange={e => updateOption(index, { ...option, options: (option.options || []).map((v, y) => {
                        if (y === i) {
                          return e.target.value;
                        }
                        return v;
                      }) })}
                    />
                    <a href="#" className="danger-link" onClick={ e => {
                      e.preventDefault();
                      updateOption(index, { ...option, options: (option.options || []).filter((v, y) => y !== i) });
                    }}>remove</a>
                  </div>
                )) }
                <div>
                  <a href="#" className="btn text-sm" onClick={ e => {
                    e.preventDefault();
                    updateOption(index, { ...option, options: (option.options || []).concat('') });
                  } }>
                    Add option
                  </a>
                </div>
              </div>
            }
            <div className="mt-3">
              <a href="#" className="danger-link" onClick={ e => removeOption(e, index) }>remove</a>
            </div>
          </div>
        ))
      }
      <div className="flex justify-start items-center">
        <a href="#" className="btn" onClick={ e => addOption(e) }>Add custom field</a>
      </div>
    </div>
  );
}

FieldsEditor.defaultProps = {
  onChange: null,
  value: []
}

export default FieldsEditor;
