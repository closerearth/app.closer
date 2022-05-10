import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState, convertFromRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
);


function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image');
      xhr.setRequestHeader('Authorization', 'Client-ID 9ea3ed43f94b8dd');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        console.log(response)
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        console.log(error)
        reject(error);
      });
    }
  );
}


const TextEditor = ({ onChange, value }) => {


  // const contentBlock = htmlToDraft(convertFromHTML((value)))
  // const contentState = ContentState.createFromBlockArray(
  //   contentBlock.contentBlocks
  // );
    
  const [editorState, setEditorState] = useState(EditorState.createEmpty());


  const onEditorStateChange = (update) => {
    setEditorState(update);
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    onEditorStateChange && onChange(html);
  };
  


  return (
    <>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        // wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      />
    </>
  );
};
export default TextEditor;
