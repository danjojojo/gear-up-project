export const base64ToFile = (base64, filename = 'image.jpg') => {
    if (!base64 || !base64.startsWith('data:image/')) {
        console.error('Invalid base64 string or missing data URL prefix');
        return null;
    }

    const [header, data] = base64.split(',');
    if (!header || !data) {
        console.error('Base64 string is improperly formatted');
        return null;
    }

    const mime = header.match(/:(.*?);/);
    if (!mime) {
        console.error('MIME type is missing from base64 string');
        return null;
    }

    const mimeType = mime[1];
    const binary = atob(data);
    const array = [];
    
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    
    return new File([new Uint8Array(array)], filename, { type: mimeType });
};