import { API_ENDPOINTS } from "./apiEndPoints";

const CLOUDINARY_UPLOAD_PRESET = "transport_web";

const uploadProfileImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
      method: "POST",
      body: formData,
    });

    // FIXED: Invert condition - handle errors only if !ok (non-2xx status)
    if (!response.ok) {
      // Try to parse error details if JSON
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (parseError) {
        // If not JSON, use status text
        console.warn("Non-JSON error response:", parseError);
      }
      throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }

    // Success path: Parse and return URL
    const data = await response.json();
    console.log("Image upload successful:", data);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadProfileImage;
