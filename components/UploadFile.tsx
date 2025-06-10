

const commonOptions = {
  url: 'http://localhost:3000/upload_raw',
  method: 'POST',
  type: 'raw', // raw data type for direct file upload
  headers: {
    'Content-Type': 'application/octet-stream', // Just a placeholder for binary upload
  },
  notification: {
    enabled: false, // Disable notification (can be adjusted if needed)
  },
};

export default async function startFileUpload(
  { path, headers }: { path: string; headers: any },
  currentIndex: number,
  totalFiles: number,
  callBack: () => void
) {
  const file = await fetch(path); // Fetch the file from the URI
  const blob = await file.blob(); // Convert the file to a Blob

  // Create FormData and append the file
  const formData = new FormData();
  formData.append('file', blob, headers.fileName);  // Append the Blob with the filename

  // Merge commonOptions with passed headers and formData
  const options = {
    ...commonOptions, // Use all common options
    headers: {
      ...commonOptions.headers, // Merge default headers
      ...headers, // Override or add new headers passed dynamically
    },
    body: formData, // Set body as the FormData object
  };

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

    const responseData = await response.json();
    console.log('Upload successful:', responseData);

    if (currentIndex === totalFiles - 1) {
      callBack();
    }
  } catch (error) {
    console.error('Upload failed:', error);

    if (currentIndex === totalFiles - 1) {
      callBack();
    }
  }
}