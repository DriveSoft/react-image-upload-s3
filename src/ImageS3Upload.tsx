import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import Resizer from "react-image-file-resizer";
import { fetchUrlSign } from "./utils";
import deleteImage from "./delete.svg";
import "./style.css";
import noImage from "./noimage.svg";

export interface ImageS3UploadProps {
    signingUrl: string;
    autoUpload: boolean;    
    value?: string;
    onChange?: (e: any) => void;    
    emptyPhoto?: string; 
    serverPhoto?: string; 
    buttonCaption?: string;
    showSize?: boolean;
    id?: string;
    name?: string;

    resizer?: {
        enabled: boolean;
        autoResize: boolean; // otherwise resizing will be preform before uploading
        maxWidth: number;
        maxHeight: number;
        compressFormat: string; // Can be either JPEG, PNG or WEBP
        quality: number; // A number between 0 and 100. Used for the JPEG compression.
        rotation: number; // Degree of clockwise rotation to apply to the image. Rotation is limited to multiples of 90 degrees.(if no rotation is needed, just set it to 0) (0, 90, 180, 270, 360)
    };

    onStart?: () => void;
    onUploaded?: () => void;
    onProgress?: (percent: number) => void;
    onFinish?: (isSuccessful: boolean, urlImage: string) => void;
    onError?: (msg: string) => void;
    onSignedUrl?: (data: any)  => void;
    onResizeStart?: () => void;
    onResizeFinish?: () => void;
}

interface RefObject {
    uploadFile: () => Promise<boolean>
}

enum stateComponent {
    none,    
    resizing,
    resized,
    startingUpload,
    uploading,
    uploaded,
    finish,
    error
}

const defaultResizingOptions = {
    enabled: false,
    autoResize: true, // otherwise resizing will be preform before uploading
    maxWidth: 1280,
    maxHeight: 1280,
    compressFormat: "JPEG",
    quality: 70,
    rotation: 0
}

export const ImageS3Upload = forwardRef<RefObject | undefined, ImageS3UploadProps>(({
    signingUrl,
    autoUpload,
    emptyPhoto = noImage,
    serverPhoto,
    value,
    onChange,
    buttonCaption = 'Browse...',
    showSize = true,
    id = '',
    name = '',
    resizer = defaultResizingOptions,
    onStart,
    onUploaded,
    onProgress,
    onFinish,
    onError,
    onSignedUrl,
    onResizeStart,
    onResizeFinish
}, ref) => {


    const inputFileEl = useRef<HTMLInputElement>(null);
    
    const [status, setStatus] = useState<{state: stateComponent, msg: string, intValue?: number}>({state: stateComponent.none, msg: ''});
    const [imagePhoto, setImagePhoto] = useState<string | undefined>(undefined);
    const [compressedPhoto, setCompressedPhoto] = useState<Blob | undefined>(undefined);
    const [buttonCaptionState, setButtonCaptionState] = useState(buttonCaption);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);    
    const [s3DataState, setS3DataState] = useState<any>(undefined);
    const [notLoad, setNotLoad] = useState(false); // to prevent loading photo from S3 when we have this photo in blob input element
    const [filenameValue, setFilenameValue] = useState('');

    // to be able to call method uploadFile
    useImperativeHandle(ref, () => ({
        uploadFile: async () => {             
            if (status.state === stateComponent.finish || status.state === stateComponent.uploaded) {
                setStatus({state: stateComponent.finish, msg: ''});
                return true;
            } 
              
            //@ts-ignore
            if (inputFileEl?.current?.files && inputFileEl.current.files.length === 1) {                
                if (status.state !== stateComponent.resizing) {                    
                    !autoUpload && onStart && onStart();
                    
                    //@ts-ignore
                    const p = await startUpload(inputFileEl?.current?.files[0].name, inputFileEl?.current?.files[0] as Blob);                                       
                    if (p) {
                        return true;
                    } else {
                        return false;
                    }
                    
                } 
                setStatus({state: stateComponent.error, msg: ''});               
                return false;
            }
            setStatus({state: stateComponent.finish, msg: ''});
            return true;                         
        }
    }));    

    useEffect(()=>{
        if (emptyPhoto) {
            setImagePhoto(emptyPhoto);    
        }  
    }, []);

    useEffect(()=>{        
        if (s3DataState?.fields?.key) {
            setNotLoad(true);            
            fireOnChange(s3DataState.fields.key);
        } 
    }, [s3DataState]);     
    
    useEffect(()=>{                  
        if (status.state === stateComponent.none) {
            setButtonCaptionState(buttonCaption); 
            setCompressedPhoto(undefined);
        }  

        if (status.state === stateComponent.resizing) {
            setButtonCaptionState("Resizing...");            
        }   

        if (status.state === stateComponent.resized) {
            showSize ? setButtonCaptionState(`Resized (${status.msg})`) : setButtonCaptionState('Resized');            
        }   

        if (status.state === stateComponent.startingUpload) {
            setButtonCaptionState("Starting... ");
            setShowSpinner(true);
        }                          
          
        if (status.state === stateComponent.uploading) {
            setButtonCaptionState(status.msg);
            if (onProgress && status?.intValue) {
                onProgress(status.intValue);
            }
        }          
            
        if (status.state === stateComponent.uploaded) {
            setButtonCaptionState('Done');
            setShowSpinner(false); 
            if (onUploaded) onUploaded();   
            if (onFinish) onFinish(true, filenameValue);
        }

        if (onFinish && status.state === stateComponent.finish) {
             onFinish(true, filenameValue);
        }  
        
        if (status.state === stateComponent.error) {
            setButtonCaptionState("Error");
            setShowSpinner(false);
            onError && onError(status.msg);
            if (onFinish) onFinish(false, filenameValue);
        }          
        
    }, [status]);


    useEffect(()=>{                        
        if (value) {
            
            if (serverPhoto == null) {
                serverPhoto = '';    
            }

            if (serverPhoto.slice(-1) != '/' && value.slice(0, 1) != '/') { // if there is no symbol / between serverPhoto and value, just add it.
                serverPhoto = serverPhoto + '/';
            }

            if (!notLoad) { // to prevent loading photo from S3 when we have this photo in blob input element
                setButtonCaptionState(buttonCaption);
                setShowSpinner(false);
                if (inputFileEl?.current) {
                    //@ts-ignore
                    inputFileEl.current.value='';
                }
                                
                setImagePhoto(`${serverPhoto}${value}`);
            }
                    
          
        } else {
            setImagePhoto(emptyPhoto);
            setButtonCaptionState(buttonCaption);
        }
               
        setNotLoad(false);
        value && setFilenameValue(value);
        
    }, [value]);   
    
    const fireOnChange = (value: string) => {
        const event = {
            persist: () => {},
            target: {
              type: "change",
              id: id,
              name: name,
              value: value
            }
          };

          setFilenameValue(value);
          onChange && onChange(event);         
    }

    const resizeFile = (file: Blob): Promise<Blob> => 
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				resizer.maxWidth,
				resizer.maxHeight,
				resizer.compressFormat,
				resizer.quality,
				resizer.rotation,
				(uri) => {
					if (uri instanceof Blob) resolve(uri);
				},
				"blob"
			);
		});

    const onChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {        
        if (event.target.files && event.target.files.length > 0) {
            autoUpload && onStart && onStart();
            setStatus({state: stateComponent.none, msg: ''});
            const file = event.target.files[0];            
            setImagePhoto(URL.createObjectURL(file)); 
            
            if (resizer.enabled && resizer.autoResize) {                                
                try {                
                    onResizeStart && onResizeStart();
                    setStatus({state: stateComponent.resizing, msg: ''});                                        
                    const image = await resizeFile(file);

                    if (image instanceof Blob) {
                        setCompressedPhoto(image);
                        setStatus({state: stateComponent.resized, msg: String(humanFileSize(image.size))});                        
    
                        if (autoUpload) {
                            startUpload(file.name, image);     
                        }
                    } else {
                        setStatus({state: stateComponent.error, msg: 'Resizing error.'});                          
                    }                     

                } catch (error) {
                    console.log('ERROR', error);
                    let message
                    if (error instanceof Error) message = error.message
                    else message = String(error)
                    setStatus({state: stateComponent.error, msg: message});                    
                } finally {
                    onResizeFinish && onResizeFinish();
                }
            } else {
                if (autoUpload) {
                    startUpload(file.name, file);     
                }                
            }            

        }                
    };

	// const fetchUrlSign = async (fileName: string) => {			
	// 	let myHeaders = new Headers();
	// 	myHeaders.append("Content-type", "application/json");  
    //     const bodyObject = {objectName: fileName};
        
    //     let res = await fetch(signingUrl, {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: JSON.stringify(bodyObject)
    //     });
        
    //     if (!res.ok) {
    //         throw new Error(`${res.status} ${res.statusText}`);
    //     }

    //     const json = await res.json();
    //     return JSON.parse(json);		
	// }

    const updateProgress = (ev: ProgressEvent<EventTarget>) => {        
        if (ev.lengthComputable) {
            let percentComplete = Math.round((ev.loaded / ev.total) * 100);            
            setStatus({state: stateComponent.uploading, msg: String(percentComplete)+'%', intValue: percentComplete})
        }
    } 

    const uploadFile = (file: Blob, s3Data: any) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", s3Data.url);
            xhr.timeout = 30000;
            xhr.upload.onprogress = updateProgress;
    
            let postData = new FormData();
            for (let key in s3Data.fields) {			
                if (key != 'file') { // in field "file" must be blob of file.
                    postData.append(key, s3Data.fields[key]);
                    //console.log('append', key, s3Data.fields[key]);
                }                    
            }
            postData.append("file", file);
    
            xhr.onload = () => {
                // transaction completes successfully.
                setStatus({state: stateComponent.uploaded, msg: ''});
                resolve(xhr.status);
            };  
    
            xhr.onerror = (e: any) => {
                reject('error');
                setShowSpinner(false);
                setButtonCaptionState('Error');                        
                setStatus({state: stateComponent.error, msg: String(e.target.status)});                                                                            
                alert(`Error during file upload (status: ${e.target.statusText})`);
            };  
    
            xhr.ontimeout = () => {
                reject('timeout');
                setShowSpinner(false);
                setButtonCaptionState('Error');                        
                setStatus({state: stateComponent.error, msg: 'Time out'});                                                                            
                alert(`Error during file upload (status: Time out)`);   
            }
                      
            xhr.send(postData);
        });
    }



    const resizerFunc = async (file: Blob): Promise<Blob | undefined> => {
        if (resizer.enabled && resizer.autoResize) {
                        
            if (compressedPhoto) { // if autoUpload = False, it's mean that resized photo in state
                return compressedPhoto;
            }

            if (file) { // if autoUpload = True, it's mean that resized photo gona be in 'file' parametr
                return file;                      
            }                    

            setStatus({state: stateComponent.error, msg: ''});
            return undefined;                
        }

        if (resizer.enabled && !resizer.autoResize) {
            try {                
                onResizeStart && onResizeStart();
                setStatus({state: stateComponent.resizing, msg: ''});                            
                const image = await resizeFile(file);

                if (image instanceof Blob) {                            
                    setStatus({state: stateComponent.resized, msg: String(humanFileSize(image.size))});  
                    return image                          
                } else {
                    setStatus({state: stateComponent.error, msg: 'Resizing error.'});
                    return undefined;
                }
                          
            } finally {
                onResizeFinish && onResizeFinish();                    
            } 
                            
        }

        if (!resizer.enabled) {
            return file; 
        }

        return undefined;
    }


    const startUpload = async (filename: string, file: Blob) => {        
        try {
            filename = filename.replace(/\s/g, ''); // remove spaces, because there is some problem with restAPI, which return url filename with %20 instead space, after that when we savind data again, %20 will be convert to %2520 (% = %25)

            setStatus({state: stateComponent.startingUpload, msg: ''});
            setS3DataState(undefined);

            const signedUrl = await fetchUrlSign(signingUrl, filename);            
            setS3DataState(signedUrl);  
            if (onSignedUrl) {
                onSignedUrl(signedUrl);
            }

            const fileForUpload = await resizerFunc(file);
            if (fileForUpload) {
                await uploadFile(fileForUpload, signedUrl);  
                return true; 
            }

            return false;

        } catch(error) {            
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);            
            setStatus({state: stateComponent.error, msg: message});
            return false;           
        }

    }

    const clearImage = () => {        
        fireOnChange('');
        setImagePhoto(emptyPhoto);        
        setStatus({state: stateComponent.none, msg: ''});
        if (inputFileEl?.current) {
            //@ts-ignore
            inputFileEl.current.value='';
        }         
    }



    return (
        <div className="imageS3UploadContainer" style={{position: "relative"}}>

            <img id="imageS3Upload" src={imagePhoto} key={imagePhoto} alt="" />
            
            <img style={{cursor: "pointer"}}
                id="imageDeleteIconS3Upload"
                src={deleteImage} 
                onClick={clearImage}                          
                alt="" 
            />
                                        
            {showSpinner && <span className="spinner"></span>} 

            <button 
                className="button" 
                type="button"
                onClick={()=>{                        
                    setShowSpinner(false);
                    setButtonCaptionState(buttonCaption);
                    //@ts-ignore                        
                    inputFileEl.current.click();
                }}
                data-testid='browseButton'
            >
                {buttonCaptionState}
                
            </button>{' '}
                                    
            <input ref={inputFileEl} type="file" accept="image/*" style={{display: "none"}} onChange={onChangeFile} data-testid='inputFile'/>                    
        </div>
    );

})

function humanFileSize(size: number) {
    const i = Math.floor( Math.log(size) / Math.log(1024) );
    const sSize = ( size / Math.pow(1024, i) ).toFixed(0);
    return `${sSize} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;        
};