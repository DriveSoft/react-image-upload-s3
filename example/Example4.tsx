import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ImageS3Upload } from '../src';

const Example4 = () => {  
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
        
        <p><b>4. Form, multiple components, autoUpload=False</b></p>

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

export default Example4