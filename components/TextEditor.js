import React, { useState, useCallback } from 'react';
import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import classNames from 'classnames';

const TextEditor = () => {
  const [editor, setEditor] = useState()

  const onRefChange = useCallback((node) => {
    if (node === null) {
      setEditor(null)
    } else {
      if (editor == null) {
        const et = new MediumEditor(node);
        setEditor(et);
      }
    }
  }, []); // adjust deps

  return (
    <div className="w-full bg-background text-black h-[500px] overflow-y-scroll mt-4">
      <div
        className={classNames(
          'w-full h-full prose text-black',
          'prose-headings:text-white ',
          'prose-a:text-[#94C7E9]',
          'focus:outline-none'
        )}
        ref={onRefChange}
      ></div>
    </div>
  );
};
export default TextEditor;