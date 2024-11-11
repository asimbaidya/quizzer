import { useState } from 'react';
import axios from 'axios';

const useImageUpload = (onUploadSuccess: { (file: string | null): void }) => {
  const [uploadedFilePath, setUploadedFilePath] = useState('');

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    let token: string | null;
    if (!localStorage.getItem('access_token')) {
      throw new Error('No Token');
    } else {
      token = localStorage.getItem('access_token');
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/API/image_upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fileId: string = response.data.file_id;
      const file_url: string = `http://127.0.0.1:8000/API/image_show/${fileId}`;
      setUploadedFilePath(file_url);
      onUploadSuccess(fileId);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return { uploadedFilePath, uploadImage, setUploadedFilePath };
};

export default useImageUpload;
