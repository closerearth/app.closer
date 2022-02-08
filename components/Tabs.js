import React, { useState } from 'react';
import PropTypes from 'prop-types';

const styleMap = {
  base: 'inline-block py-4 px-4 text-sm font-medium text-center rounded-t-lg',
  normal: 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
  active: 'text-primary border-b-2 border-primary active',
  disabled: 'text-gray-400 cursor-not-allowed dark:text-gray-500'
};

const Tabs = ({ tabs, onChange }) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        { tabs && tabs.map((tab, index) => (
          <li className="mr-2" key={ `${tab.value || index}` }>
            <a
              href="#"
              onClick={ (e) => {
                e.preventDefault();
                setCurrentTab(index);
                if (onChange) {
                  onChange(tab);
                }
              } }
              className={ `${styleMap.base} ${tab.disabled ? styleMap.disabled : index === currentTab ? styleMap.active : styleMap.normal}` }
            >
                { tab.title }
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
Tabs.propTypes = {
  tabs: PropTypes.array,
  onChange: PropTypes.func
}

export default Tabs;