import { Trash, Upload, User } from "lucide-react";
import React, { useRef, useState } from "react";

const ProfileImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreviewUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseFile = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          onClick={onChooseFile}
          className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-[#F5EFFF] to-[#E5D9F2] rounded-full border-2 border-dashed border-[#A594F9] relative group cursor-pointer hover:shadow-lg hover:from-[#8A75EB] hover:to-[#A594F9] transition-all duration-300"
        >
          <User className="text-[#A594F9] group-hover:text-white" size={40} />

          <button
            onClick={onChooseFile}
            type="button"
            className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-[#A594F9] hover:bg-[#A594F9] transition-all duration-300"
          >
            <Upload
              className="text-[#A594F9] group-hover:text-white"
              size={18}
            />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#A594F9]"
          />

          <button
            onClick={handleRemoveImage}
            type="button"
            className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full border-2 border-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageSelector;
