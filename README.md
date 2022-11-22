## Summary

A React component that renders an image input and uploads to an S3 bucket. Optionally can perform resizing and compressing of the image.

- ready to use an input element with preview of a image
- resizing and compressing of an image on frontend to reduce traffic and increase speed of uploading

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
  const URL_GENERATE_S3_URLKEY = 'http://127.0.0.1:8000/api/citytree/s3/generate_signed_url/';
  const SERVER_PHOTO = 'https://urbangis.s3.eu-central-1.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0,
  };

  const onFinish = (isSuccessful: boolean, urlImage: string) => {
    if (isSuccessful) {
      console.log('onFinish', urlImage);
    } else {
      console.log('onFinish', 'Unsuccessful');
    }
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
      <ImageS3Upload
        signingUrl={URL_GENERATE_S3_URLKEY}
        autoUpload={true}
        serverPhoto={SERVER_PHOTO}
        onFinish={onFinish}
        resizer={resizerOptions}
      />
    </div>
  );
}

export default App;
```
