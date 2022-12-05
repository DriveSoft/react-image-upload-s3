import * as React from 'react';
import { ImageS3Upload } from '../src';

const Example1 = () => {
	const URL_GENERATE_S3_URLKEY = 'http://127.0.0.1:8000/api/citytree/s3/generate_signed_url/';
	const SERVER_PHOTO = 'https://urbangis.s3.eu-central-1.amazonaws.com/';		
		
    const resizerOptions = {
        enabled: true,
        autoResize: true, // otherwise resizing will be preform before uploading, the parametr doesn't make sense if autoUpload = True
        maxWidth: 1280,
        maxHeight: 1280,
        compressFormat: "JPEG",
        quality: 70,
        rotation: 0            
    };

    const onFinish = (isSuccessful: boolean, urlImage: string) => {
        if (isSuccessful) {
            console.log('onFinish', urlImage);
        } else {
            console.log('onFinish', 'Unsuccessful');    
        }
    }

    return (
        <div style={{maxWidth: "200px", margin: "10px", padding: "10px", border: "solid 1px black"}}>
            <p><b>1. Simple, autoUpload=True</b></p>
          
                <ImageS3Upload  
                    signingUrl={URL_GENERATE_S3_URLKEY}					
                    autoUpload={true}											
                    serverPhoto={SERVER_PHOTO}													
                    onFinish={onFinish}
                    resizer={resizerOptions}																																						
                />	      
        </div>
    )
}

export default Example1