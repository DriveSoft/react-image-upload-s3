//https://www.youtube.com/watch?v=Flo268xRpV0 - React Testing Tutorial with React Testing Library and Jest
import React from 'react';
import { ImageS3Upload } from './ImageS3Upload';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
//import userEvent from '@testing-library/user-event'

import fs from "fs";
//import { Blob } from "buffer";

const URL_GENERATE_S3_URLKEY =
  'http://127.0.0.1:8000/api/citytree/s3/generate_signed_url/';
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


jest.setTimeout(1000);


describe('ImageS3Upload', () => {
    window.URL.createObjectURL = jest.fn();

    afterEach(() => {
      //@ts-ignore
        window.URL.createObjectURL.mockReset(()=>'url');
    });


    it('it renders', async () => {
        render(
        <ImageS3Upload
            signingUrl={URL_GENERATE_S3_URLKEY}
            autoUpload={true}
            serverPhoto={SERVER_PHOTO}
            resizer={resizerOptions}
            buttonCaption="Browse..."
        />
        );
        expect(
        screen.getByRole('button', { name: 'Browse...' })
        ).toBeInTheDocument();
    });
 

    it('assign a file to input then resizing have to begin (autoResize=True)', async () => {
        render(
            <ImageS3Upload
                signingUrl={URL_GENERATE_S3_URLKEY}
                autoUpload={false}
                serverPhoto={SERVER_PHOTO}
                resizer={resizerOptions}
                buttonCaption="Browse..."
            />
        );

        console.log( require.resolve( "test.jpg" ) );

        let buffer = fs.readFileSync(require.resolve("test.jpg"));        
        let blob = new Blob([buffer], {type: 'image/jpg'});      
        const imageFile = new File([blob], 'test.jpg', {lastModified: Number(new Date()), type: 'image/jpg'}); //!!! return empty object, why? https://stackoverflow.com/questions/64100280/how-to-insert-real-file-object-to-function-in-react-unit-tests       
    
        const fileInput = screen.getByTestId('inputFile');
        console.log(imageFile)
        
        expect(await screen.findByTestId('browseButton')).toHaveTextContent('Browse...');
        
        //userEvent.upload(fileInput, imageFile);
        fireEvent.change(fileInput, {
            target: { files: { item: () => imageFile, length: 1, 0: imageFile } },
        });    
        await new Promise((r) => setTimeout(r, 500));        
        expect(await screen.findByTestId('browseButton')).toHaveTextContent('Resizing...');

    });

 
});

 
