import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from '../src';

const Example5 = () => {  
  const URL_GENERATE_S3_URLKEY = 'http://127.0.0.1:8000/api/citytree/s3/generate_signed_url/';
  const SERVER_PHOTO = 'https://urbangis.s3.eu-central-1.amazonaws.com/';

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

        <p><b>5. Form, multiple components, autoUpload=True</b></p>

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

export default Example5