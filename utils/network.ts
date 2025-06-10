
export default async function isServerAvailable(url = 'http://localhost:3000/upload_raw'): Promise<boolean> {
  try {
    // Create an AbortController to handle the fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // Abort after 1 second

    // Make the network request with the AbortController to handle timeouts
    const response = await fetch(url, { signal: controller.signal });
    
    // Clear the timeout once the request is successful
    clearTimeout(timeoutId);

    // Check if the response is successful (2xx or 3xx status codes)
    return response.ok; // `response.ok` will be true for 2xx or 3xx status codes
  } catch (err:any) {
    // If there's an error (timeout, network failure, etc.), log it and return false
    console.warn('Server check failed:', err.message || err);
    return false;
  }
}