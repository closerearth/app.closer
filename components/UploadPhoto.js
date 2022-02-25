import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api, { formatSearch } from '../utils/api';
import { useAuth } from '../contexts/auth.js';

const UploadPhoto = ({ model, id, onSave, label, minimal }) => {

  const { isAuthenticated, user } = useAuth();
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const upload = async (file) => {
    setErrors(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data: { results: photo } } = await api.post('/upload/photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      if (model && id) {
        await api.patch(`/${model}/${id}`, { photo: photo._id });
      }
      setLoading(false);
      console.log('Photo uploaded!', photo);
      if (onSave) {
        onSave(photo._id);
      }
    } catch (err) {
      console.log(err);
      setErrors(err.message);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => upload(file))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div {...getRootProps()} className={`upload-photo cursor-pointer ${minimal?'':'p-2 w-full h-full flex items-center justify-center'}`}>
      <input {...getInputProps()} />
      {
        loading?
          <p>Uploading...</p>:
          isDragActive ?
            <p>Drop files here</p> :
            <p className="btn-primary">{ label }</p>
      }
    </div>
  );
}
UploadPhoto.defaultProps = {
  minimal: false
}

export default UploadPhoto;
