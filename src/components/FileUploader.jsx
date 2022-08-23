import React from 'react';
// import uploadFile from '../images/upload-file.svg';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useState } from 'react';
import Icon from '@mui/material/Icon';

const BASE_URL = 'http://localhost:8001/';

const FileUpload = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState('');

  const saveFile = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async e => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData);
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className='App'>
      <input type='file' onChange={saveFile} />
      <button className='absolute top-1 left-1' onClick={uploadFile}>
        <Icon sx={{ color: green[500] }}>add_circle</Icon>
      </button>
    </div>
  );
};

// const FileUploader = props => {
//   const hiddenFileInput = React.useRef(null);

//   const handleClick = event => {
//     hiddenFileInput.current.click();
//   };
//   const handleChange = event => {
//     const fileUploaded = event.target.files[0];
//     console.log('fileUploaded', fileUploaded);

//     props.handleFile(fileUploaded);
//   };
//   return (
//     <div>
//       <button className='absolute top-1 left-1' onClick={handleClick}>
//         <Icon sx={{ color: green[500] }}>add_circle</Icon>
//       </button>
//       <input
//         type='file'
//         ref={hiddenFileInput}
//         onChange={handleChange}
//         style={{ display: 'none' }}
//       />
//     </div>
//   );
// };
export default FileUpload;
