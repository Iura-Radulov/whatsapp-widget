import React from 'react';
import uploadFile from '../images/upload-file.svg';

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    props.handleFile(fileUploaded.name);
  };
  return (
    <>
      <button className='absolute left-2' onClick={handleClick}>
        <img className='w-6' src={uploadFile} alt='upload file' />
      </button>
      <input
        type='file'
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
};
export default FileUploader;
