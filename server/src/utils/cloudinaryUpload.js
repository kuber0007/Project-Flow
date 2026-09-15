import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (
  buffer,
  folder
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    }
  );
};

const deleteFromCloudinary = async (
  publicId
) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
    }
  );
};

export {
  uploadToCloudinary,
  deleteFromCloudinary,
};