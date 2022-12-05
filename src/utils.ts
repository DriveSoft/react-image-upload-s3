export const fetchUrlSign = async (signingUrl: string, fileName: string) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");  
    const bodyObject = {objectName: fileName};
    
    let res = await fetch(signingUrl, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObject)
    });
    
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return JSON.parse(json);
}