import { useRef, useState } from "react";

export const useFileDrop = ({
  setFile,
  setBlob,
  setFileData,
}: {
  setFile: any;
  setBlob: any;
  multiple?: boolean;
  cropper?: any;
  setCropperOpen?: any;
  blob: any;
  setFileData: any;
}) => {
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFile(files);
  };

  const handleDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleFile = (files) => {
    setLoading(true);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      //TODO: implement image upload with specific api
      // imageApi
      //   .uploadImage(files[0])
      //   .then((data) => {
      //     setBlob(files[0]);
      //     setFile(reader.result);
      //     setFileData(data);
      //     setLoading(false);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     setLoading(false);
      //   });
    });
    try {
      reader.readAsDataURL(files[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return { loading, fileInput, handleDrop, handleDrag, handleFile };
};
