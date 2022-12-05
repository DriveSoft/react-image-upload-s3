import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from '../src';

const Example3 = () => {  
  const URL_GENERATE_S3_URLKEY = 'http://127.0.0.1:8000/api/citytree/s3/generate_signed_url/';
  const SERVER_PHOTO = 'https://urbangis.s3.eu-central-1.amazonaws.com/';

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

      <p><b>3. Form, autoUpload=True</b></p>

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

export default Example3