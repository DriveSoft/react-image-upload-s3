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

## Example 1

autoUpload=True

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://yourserver.com/s3/sign/';
  const SERVER_PHOTO = 'https://example.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0, // rotation is limited to multiples of 90 degrees
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

## Example 2

autoUpload=False

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://yourserver.com/s3/sign/';
  const SERVER_PHOTO = 'https://example.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0, // rotation is limited to multiples of 90 degrees
  };

  const refS3Uploader = useRef(); // to be able to call method uploadFile

  const [comment, setComment] = useState('');
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

  const onResizeStart = () => {
    setSubmitButtonDisabled(true);
  };

  const onResizeFinish = () => {
    setSubmitButtonDisabled(false);
  };

  const submitingData = () => {
    const dataToSend = {
      comment,
      imageS3URL,
    };
    console.log('submitingData', dataToSend);
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

## Example 3

autoUpload=True

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://yourserver.com/s3/sign/';
  const SERVER_PHOTO = 'https://example.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0, // rotation is limited to multiples of 90 degrees
  };

  const [comment, setComment] = useState('');
  const [imageS3URL, setImageS3URL] = useState('');

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const dataToSend = {
      comment,
      imageS3URL,
    };
    console.log('onSubmit', dataToSend);
  };

  const onStart = () => {
    setSubmitButtonDisabled(true);
  };

  const onFinish = (isSuccessful: boolean) => {
    setSubmitButtonDisabled(false);
    console.log('isSuccessful', isSuccessful);
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
      <form onSubmit={onSubmit}>
        <label htmlFor="id_comment2">Comment</label>
        <input
          type="text"
          id="id_comment2"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <br />
        <br />

        <ImageS3Upload
          signingUrl={URL_GENERATE_S3_URLKEY}
          autoUpload={true}
          serverPhoto={SERVER_PHOTO}
          onStart={onStart}
          onFinish={onFinish}
          resizer={resizerOptions}
          value={imageS3URL}
          onChange={e => setImageS3URL(e.target.value)}
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

## Example 4

Multiple components in one form
autoUpload=False

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://yourserver.com/s3/sign/';
  const SERVER_PHOTO = 'https://example.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0, // rotation is limited to multiples of 90 degrees
  };

  const refS3Uploader1 = useRef(); // to be able to call method uploadFile
  const refS3Uploader2 = useRef(); // to be able to call method uploadFile
  const refS3Uploader3 = useRef(); // to be able to call method uploadFile

  const [comment1, setComment1] = useState('');
  const [comment2, setComment2] = useState('');
  const [comment3, setComment3] = useState('');
  const [imageS3URL1, setImageS3URL1] = useState('');
  const [imageS3URL2, setImageS3URL2] = useState('');
  const [imageS3URL3, setImageS3URL3] = useState('');

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [submitData, setSubmitData] = useState(false);

  useEffect(() => {
    setSubmitData(false);
    submitData && dataToSubmit();
  }, [submitData]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitButtonDisabled(true);
    Promise.all([
      //@ts-ignore
      refS3Uploader1.current.uploadFile(),
      //@ts-ignore
      refS3Uploader2.current.uploadFile(),
      //@ts-ignore
      refS3Uploader3.current.uploadFile(),
    ]).then(values => {
      setSubmitButtonDisabled(false);
      let result = true;
      values.forEach(value => {
        if (!value) result = false;
      });
      result && setSubmitData(true);
    });
  };

  const dataToSubmit = () => {
    const data = {
      comment1: comment1,
      image1: imageS3URL1,
      comment2: comment2,
      image2: imageS3URL2,
      comment3: comment3,
      image3: imageS3URL3,
    };
    console.log('submitData', data);
  };

  const onResizeStart1 = () => {
    setSubmitButtonDisabled(true);
  };
  const onResizeStart2 = () => {
    setSubmitButtonDisabled(true);
  };
  const onResizeStart3 = () => {
    setSubmitButtonDisabled(true);
  };

  const onResizeFinish1 = () => {
    setSubmitButtonDisabled(false);
  };
  const onResizeFinish2 = () => {
    setSubmitButtonDisabled(false);
  };
  const onResizeFinish3 = () => {
    setSubmitButtonDisabled(false);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{ margin: '10px', padding: '10px', border: 'solid 1px black' }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment1">Comment</label>
            <input
              type="text"
              id="id_comment1"
              value={comment1}
              onChange={e => setComment1(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={false}
              serverPhoto={SERVER_PHOTO}
              resizer={resizerOptions}
              onResizeStart={onResizeStart1}
              onResizeFinish={onResizeFinish1}
              ref={refS3Uploader1}
              value={imageS3URL1}
              onChange={(e: any) => setImageS3URL1(e.target.value)}
            />
          </div>

          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment4">Comment</label>
            <input
              type="text"
              id="id_comment4"
              value={comment2}
              onChange={e => setComment2(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={false}
              serverPhoto={SERVER_PHOTO}
              resizer={resizerOptions}
              onResizeStart={onResizeStart2}
              onResizeFinish={onResizeFinish2}
              ref={refS3Uploader2}
              value={imageS3URL2}
              onChange={(e: any) => setImageS3URL2(e.target.value)}
            />
          </div>

          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment5">Comment</label>
            <input
              type="text"
              id="id_comment5"
              value={comment3}
              onChange={e => setComment3(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={false}
              serverPhoto={SERVER_PHOTO}
              resizer={resizerOptions}
              onResizeStart={onResizeStart3}
              onResizeFinish={onResizeFinish3}
              ref={refS3Uploader3}
              value={imageS3URL3}
              onChange={(e: any) => setImageS3URL3(e.target.value)}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Submit"
          style={{ width: '100%' }}
          className="button"
          disabled={submitButtonDisabled}
        ></input>
      </form>
    </>
  );
}

export default App;
```

## Example 5

Multiple components in one form
autoUpload=True

```js
import React, { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from 'react-image-upload-s3';

function App() {
  const URL_GENERATE_S3_URLKEY = 'https://yourserver.com/s3/sign/';
  const SERVER_PHOTO = 'https://example.amazonaws.com/';

  const resizerOptions = {
    enabled: true,
    autoResize: true, // otherwise resizing will be preform before uploading
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: 'JPEG',
    quality: 70,
    rotation: 0,
  };

  const [uploadStatus, setUploadStatus] = useState({
    image1: true,
    image2: true,
    image3: true,
  });

  const [comment1, setComment1] = useState('');
  const [comment2, setComment2] = useState('');
  const [comment3, setComment3] = useState('');
  const [imageS3URL1, setImageS3URL1] = useState('');
  const [imageS3URL2, setImageS3URL2] = useState('');
  const [imageS3URL3, setImageS3URL3] = useState('');

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    if (uploadStatus.image1 && uploadStatus.image2 && uploadStatus.image3) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [uploadStatus]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      comment1: comment1,
      image1: imageS3URL1,
      comment2: comment2,
      image2: imageS3URL2,
      comment3: comment3,
      image3: imageS3URL3,
    };
    console.log('submitedData', data);
  };

  const onStart1 = () => {
    setUploadStatus((prev: any) => ({ ...prev, image1: false }));
  };

  const onStart2 = () => {
    setUploadStatus((prev: any) => ({ ...prev, image2: false }));
  };

  const onStart3 = () => {
    setUploadStatus((prev: any) => ({ ...prev, image3: false }));
  };

  const onFinish1 = (isSuccessful: boolean) => {
    setUploadStatus((prev: any) => ({ ...prev, image1: true }));
  };

  const onFinish2 = (isSuccessful: boolean) => {
    setUploadStatus((prev: any) => ({ ...prev, image2: true }));
  };

  const onFinish3 = (isSuccessful: boolean) => {
    setUploadStatus((prev: any) => ({ ...prev, image3: true }));
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{ margin: '10px', padding: '10px', border: 'solid 1px black' }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment1">Comment</label>
            <input
              type="text"
              id="id_comment1"
              value={comment1}
              onChange={e => setComment1(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={true}
              serverPhoto={SERVER_PHOTO}
              onStart={onStart1}
              onFinish={onFinish1}
              resizer={resizerOptions}
              value={imageS3URL1}
              onChange={e => setImageS3URL1(e.target.value)}
            />
          </div>

          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment2">Comment</label>
            <input
              type="text"
              id="id_comment2"
              value={comment2}
              onChange={e => setComment2(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={true}
              serverPhoto={SERVER_PHOTO}
              onStart={onStart2}
              onFinish={onFinish2}
              resizer={resizerOptions}
              value={imageS3URL2}
              onChange={e => setImageS3URL2(e.target.value)}
            />
          </div>

          <div style={{ maxWidth: '200px', margin: '10px' }}>
            <label htmlFor="id_comment3">Comment</label>
            <input
              type="text"
              id="id_comment3"
              value={comment3}
              onChange={e => setComment3(e.target.value)}
            />
            <br />
            <br />
            <ImageS3Upload
              signingUrl={URL_GENERATE_S3_URLKEY}
              autoUpload={true}
              serverPhoto={SERVER_PHOTO}
              onStart={onStart3}
              onFinish={onFinish3}
              resizer={resizerOptions}
              value={imageS3URL3}
              onChange={e => setImageS3URL3(e.target.value)}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Submit"
          style={{ width: '100%' }}
          className="button"
          disabled={submitButtonDisabled}
        ></input>
      </form>
    </>
  );
}

export default App;
```


## Options

| Option            | Description                                                                                                                                                            | Type       | Required |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| `signingUrl`      | To receive a presigned URL.                                                                                                                                            | `string`   | Yes      |
| `autoUpload`      | Whether an image will be upload immediately, otherwise you should call a method refImageS3Upload.current.uploadFile() to start uploading.                              | `boolean`  | Yes      |
| `serverPhoto`     | S3 storage Service endpoints. For example: https://bucket_name.s3.us-east-2.amazonaws.com/                                                                             | `string`   | No       |
| `emptyPhoto`      | You can change a default empty background.                                                                                                                             | `string`   | No       |
| `buttonCaption`   | You can change caption on the button. The default value is 'Browse...'                                                                                                 | `string`   | No       |
| `showSize`        | Wether to show file size after resizing on the button. The default value is True                                                                                       | `boolean`  | No       |
| `value`           | Value of component (file name)                                                                                                                                         | `string`   | No       |
| `resizer`         | See Resizer options section.                                                                                                                                           | `object`   | No       |
| `uploadFile`      | Method to start uploading: () => Promise<boolean>                                                                                                                      | `method`   |          |
| `onStart`         | () => void                                                                                                                                                             | `function` | No       |
| `onFinish`        | (isSuccessful: boolean, urlImage: string) => void                                                                                                                      | `function` | No       |
| `onUploaded`      | () => void                                                                                                                                                             | `function` | No       |
| `onProgress`      | (percent: number) => void                                                                                                                                              | `function` | No       |
| `onResizeStart`   | () => void                                                                                                                                                             | `function` | No       |
| `onResizeFinish`  | () => void                                                                                                                                                             | `function` | No       |
| `onSignedUrl`     | (data: any)  => void                                                                                                                                                   | `function` | No       |
| `onError`         | (msg: string) => void                                                                                                                                                  | `function` | No       |



## Resizer options

| Option            | Description                                                                                                                                                            | Type       | Required |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| `enabled`         | Whether the resizer is enabled or disabled.                                                                                                                            | `boolean`  | Yes      |
| `autoResize`      | Start the process of resizing immediately after selecting the file, otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True       | `boolean`  | Yes      |
| `maxWidth`        | New image max width (ratio is preserved)                                                                                                                               | `number`   | Yes      |
| `maxHeight`       | New image max height (ratio is preserved)                                                                                                                              | `number`   | Yes      |
| `compressFormat`  | Can be either **JPEG**, **PNG** or **WEBP**.                                                                                                                           | `string`   | Yes      |
| `quality`         | A number between 0 and 100. Used for the JPEG compression.(if no compress is needed, just set it to 100)                                                               | `number`   | Yes      |
| `rotation`        | Degree of clockwise rotation to apply to the image. Rotation is limited to multiples of 90 degrees.(if no rotation is needed, just set it to 0) (0, 90, 180, 270, 360) | `number`   | Yes      |



## License

[MIT](https://opensource.org/licenses/mit-license.html)
