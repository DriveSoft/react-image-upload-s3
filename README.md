## Summary

A React component that renders an image input and uploads to an S3 bucket. Optionally can perform resizing and compressing of the image.

- ready to use an input element with preview of a image
- resizing and compressing of an image on frontend to reduce traffic and increase speed


## How does it look like

![Editor](https://github.com/DriveSoft/images/blob/master/react-image-upload-s3.png?raw=true)


## Installation

```
npm install react-image-upload-s3
```

## Usage

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://example.com/s3/generate_signed_url/';
  const SERVER_PHOTO = 'https://example.s3.eu-central-1.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0,
  };

  const refS3Uploader = useRef(); // to be able to call a method uploadFile
  const [comment, setComment1] = useState('');
  const [imageS3URL, setImageS3URL] = useState('');

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [submitData, setSubmitData] = useState(false);

  useEffect(() => {
    setSubmitData(false);
    submitData && submitingData();
  }, [submitData]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitButtonDisabled(true);
    //@ts-ignore
    const isSuccess = await refS3Uploader.current.uploadFile();
    setSubmitButtonDisabled(false);
    isSuccess && setSubmitData(true);
  };

  const submitingData = () => {
    const dataToSend = {
      comment,
      imageS3URL,
    };
  };

  const onResizeStart = () => {
    setSubmitButtonDisabled(true);
  };

  const onResizeFinish = () => {
    setSubmitButtonDisabled(false);
  };

  return (
    <div
      style={{
        maxWidth: '200px',
        margin: '10px',
        padding: '10px',
        border: 'solid 1px black',
      }}
    >
      <p>
        <b>1. Single, autoUpload=False</b>
      </p>
      <form onSubmit={onSubmit}>
        <label htmlFor="id_comment1">Comment</label>
        <input
          type="text"
          id="id_comment1"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <br />
        <br />

        <ImageS3Upload
          signingUrl={URL_GENERATE_S3_URLKEY}
          autoUpload={false}
          serverPhoto={SERVER_PHOTO}
          resizer={resizerOptions}
          onResizeStart={onResizeStart}
          onResizeFinish={onResizeFinish}
          ref={refS3Uploader}
          value={imageS3URL}
          onChange={(e: any) => setImageS3URL(e.target.value)}
        />

        <br />
        <br />

        <input
          type="submit"
          value="Submit"
          style={{ width: '100%' }}
          className="button"
          disabled={submitButtonDisabled}
        ></input>
      </form>
    </div>
  );
}

export default App;
```
