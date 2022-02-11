import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import objectPath from 'object-path';
import Switch from './Switch';
import Autocomplete from './Autocomplete';
import DateTimePicker from './DateTimePicker';
import { trackEvent } from './Analytics';
import api, { formatSearch } from '../utils/api';
import { useAuth } from '../contexts/auth.js';

export const currencies = [
  {
    value: 'EUR',
    label: 'Euros',
    symbol: '€'
  },
  {
    value: 'USD',
    label: 'US Dollars',
    symbol: '$'
  },
];

const getSample = (field) => {
  switch(field.type) {
    case 'text':
    case 'longtext':
    case 'email':
    case 'phone':
      return '';
    case 'number':
      return 0;
    case 'currency':
      return 0;
    case 'tags':
      return [];
    case 'date':
      return null;
    case 'switch':
      return false;
    case 'datetime':
      return null;
    case 'select':
      return field.options && field.options[0] && field.options[0].value;
    case 'autocomplete':
    case 'currencies':
      return [
        {
          cur: currencies[0].value,
          val: 0
        }
      ];
    default:
      throw new Error(`Invalid model type:${field.type}`);
  }
}
// If no id is passed, we are creating a new model
const EditModel = ({
  fields,
  id,
  initialData,
  buttonText,
  endpoint,
  onSave,
  onUpdate,
  onError,
  onDelete,
  allowDelete,
  deleteButton,
  isPublic
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const initialModel = initialData || fields.reduce((acc, field) => ({ ...acc, [field.name]: field.default || getSample(field) }), {});
  const [data, setData] = useState(initialModel);
  const [addTag, setAddTag] = useState('');
  // creates an object like { myFeature: true }
  const toggles = fields.reduce((acc, field) => field.toggleFeature ? ({ ...acc, [field.name]: !!data[field.name] }) : acc, {});
  const [featureToggles, setFeatureToggles] = useState(toggles);

  // Name: visibleBy, value: [1], option: 1, actionType: ADD
  const update = (name, value, option, actionType) => {
    const copy = {...data};
    objectPath.set(copy, name, value);
    setData(copy);

    if (onUpdate) {
      onUpdate(name, value, option, actionType);
    }
  };
  const [error, setErrors] = useState(false);

  const loadData = async () => {
    try {
      if (id && !initialData) {
        const { data: { results: modelData } } = await api.get(`${endpoint}/${id}`);
        setData(modelData);
        // Look out for dependent data
        await Promise.all(fields.map(async (field) => {
          if (
            field.type === 'autocomplete' &&
            field.endpoint &&
            modelData[field.name] &&
            typeof modelData[field.name][0] !== 'object'
          ) {
            const params = { where: { _id: { $in: modelData[field.name] } } };
            const { data: { results } } = await api.get(field.endpoint, { params });
            update(field.name, results);
          }
        }));
      }
    } catch (err) {
      setErrors(err.response?.data?.error || err.message)
    }
  };
  const validate = updatedData => {
    const validationErrors = [];
    fields.forEach(field => {
      if (field.required && !updatedData[field.name]) {
        validationErrors.push(field.name);
      }
    })
    if (validationErrors.length > 0) {
      throw new Error(`Please set a valid ${validationErrors.join(', ')}`);
    }
  }
  const save = async (updatedData) => {
    setErrors(null);
    try {
      validate(updatedData);
      const method = id ? 'patch' : 'post';
      const route = id ? `${endpoint}/${id}` : endpoint;
      trackEvent(`EditModel:${endpoint}:${id ? id : 'new'}`, method);
      const { data: { results: savedData } } = await api[method](route, updatedData);
      if (onSave) {
        onSave(savedData);
      }
    } catch (err) {
      setErrors(err.message);
      if (onError) {
        onError(err.message);
      }
    }
  };
  const deleteObject = async () => {
    setErrors(null);
    try {
      if (!data._id) {
        throw new Error(`Attempting to delete ${endpoint} but no _id provided.`);
      }
      trackEvent(`EditModel:${endpoint}:${id ? id : 'new'}`, 'delete');
      await api.delete(`${endpoint}/${data._id}`);
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      setErrors(err.message);
      if (onError) {
        onError(err.message);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!isPublic && !isAuthenticated) {
    return <div className="validation-error card">User not authenticated.</div>;
  } else if (!isPublic && data.createdBy && user && (data.createdBy !== user._id && !user.roles.includes('admin'))) {
    return <div className="validation-error card">You may not edit this item.</div>;
  }

  return (
    <form
      action="#"
      onSubmit={(e) => {
        e.preventDefault();
        save(data);
      }}
    >
      { error &&
        <div className="validation-error">{ error }</div>
      }
      {
        fields && fields
        .filter((field) => {
          if (field.showIf) {
            if (field.showIf.some(({ field, value }) => data[field] === value)) {
              return true;
            }
            return false;
          }
          return true;
        })
        .map(({ label, placeholder, name, type, required, options, endpoint, searchField, multi, defaultValue, toggleFeature, toggleLabel }) => {
          const currency = type === 'currency' && currencies.find(cur => cur.value === data[name]?.cur);

          return (
            <div className={`form-field w-full mb-4 form-type-${type}`} key={ name }>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{ label }</label>
              { toggleFeature && (
                <div className={`form-field w-full mb-4 form-type-${type}`} key={ name }>
                  <Switch
                    checked={ featureToggles[name] }
                    onChange={ () => {
                      setFeatureToggles({ ...featureToggles, [name]: !featureToggles[name] });
                      if (!featureToggles[name]) {
                        update(name, defaultValue || '')
                      }
                    } }
                    label={ toggleLabel }
                  />
                </div>
              ) }
              { (!toggleFeature || featureToggles[name]) &&
                <>
                  { ['text', 'email', 'phone', 'hidden', 'number', 'date'].includes(type) && <input
                    type={ type }
                    value={ data[name] }
                    placeholder={ placeholder }
                    onChange={e => update(name, e.target.value)}
                    required={ required }
                  /> }
                  { type === 'datetime' &&
                    <DateTimePicker
                      value={ data[name] }
                      onChange={value => update(name, value)}
                    />
                  }
                  { type === 'longtext' && <textarea
                    // type={ type }
                    value={ data[name] }
                    placeholder={ placeholder }
                    onChange={e => update(name, e.target.value)}
                    required={ required }
                    className="textarea"
                  /> }
                  { type === 'currency' &&
                    <div className="currency-group flex justify-start items-center">
                      <select
                          value={ data[name]?.cur }
                          onChange={e => update(`${name}.cur`, e.target.value)}
                        >
                        {currencies.map(opt => (
                          <option value={ opt.value } key={opt.value}>
                            {opt.symbol} - {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="Number"
                        min="1.00"
                        max="1000000.00"
                        step="1.00"
                        value={ data[name]?.val || '' }
                        placeholder={ placeholder }
                        onChange={e => update(`${name}.val`, e.target.value)}
                        required={ required }
                      />
                  </div>}
                  { type === 'currencies' &&
                    <div className="currencies-group">
                      { (data[name] || []).map((currencyGroup, index) => (
                        <div className="currency-group" key={ `${name}.${index}.cur` }>
                          <select
                              value={ data[name]?.cur }
                              onChange={e => update(`${name}.${index}.cur`, e.target.value)}
                            >
                            {currencies.map(opt => (
                              <option value={ opt.value } key={opt.value}>
                                {opt.symbol} - {opt.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type={ type }
                            value={ data[name][index]?.val || '' }
                            placeholder={ placeholder }
                            onChange={e => update(`${name}.${index}.val`, e.target.value)}
                            required={ required }
                          />
                          { index > 0 &&
                            <a href="#" onClick={ (e) => {
                              e.preventDefault();
                              update(name, (data[name] || []).filter((c,i) => i !== index));
                            }}>Remove</a>
                          }
                        </div>
                      )) }
                      <a href="#" onClick={ (e) => {
                        e.preventDefault();
                        update(name, (data[name] || []).concat({ cur: currencies[0].value, val: 0 }));
                      } }>Add currency</a>
                    </div>
                  }
                  { type === 'select' &&
                    <select
                        value={ data[name] }
                        onChange={e => update(name, e.target.value)}
                      >
                      {options.map(opt => (
                        <option value={ opt.value } key={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  }
                  { type === 'switch' &&
                    <Switch
                      name={ name }
                      onChange={checked => update(name, checked)}
                      checked={!!objectPath.get(data, name)}
                    />
                  }
                  { type === 'tags' &&
                    <div className="tags">
                      { data[name] && data[name].length > 0 && data[name].map(tag => (
                        <div className="tag" key={ tag } >
                            <span className="ellipsis">{ tag }</span>
                            <a
                              href="#"
                              className="remove"
                              onClick={ () => {
                                update(name, data[name].filter(el => el !== tag), tag, 'DELETE')
                              }}
                            >
                              X
                            </a>
                        </div>
                      ))}
                      <input
                        type="text"
                        className="inline"
                        placeholder={ placeholder || 'Add tag' }
                        value={ addTag }
                        title="Press enter to add"
                        onKeyPress={ e => {
                          if (e.which === 13) {
                            e.preventDefault();
                            e.stopPropagation();
                            update(name, data[name].concat(addTag));
                            setAddTag('');
                          }
                        }}
                        onChange={e => setAddTag(e.target.value)}
                      />
                    </div>
                  }
                  { type === 'autocomplete' &&
                    <div className="autocomplete-container">
                      <div className="tags">
                        {data[name].map(item => item._id && (
                          <span className="tag" key={ item._id }>
                            {item.screenname || item.name}
                            <a
                              href="#"
                              className="remove"
                              onClick={ (e) => {
                                e.preventDefault();
                                update(name, data[name].filter(el => el._id !== item._id), item, 'DELETE')
                              }}
                            >
                              X
                            </a>
                          </span>
                        ))}
                      </div>
                      <Autocomplete
                        multi={ multi }
                        endpoint={endpoint}
                        searchField={searchField}
                        value={ data[name] }
                        onChange={(value, option, actionType) => update(name, value, option, actionType)}
                      />
                    </div>
                  }
                </>
              }
              </div>
            );
          }
        )
      }
      <div className="mt-2">
        <button type="submit" className="btn-primary">
          { buttonText }
        </button>
        { allowDelete && <a href="#" className="text-red-700 ml-2" onClick={ (e) => {
          e.preventDefault();
          deleteObject();
        } }>
          { deleteButton }
        </a> }
      </div>
    </form>
  )
};

EditModel.defaultProps = {
  fields: [],
  buttonText: 'Save',
  allowDelete: false,
  deleteButton: 'Delete',
  isPublic: false
};

export default EditModel;
