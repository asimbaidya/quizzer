import { useState } from 'react';
import axios from 'axios';

const useImageUpload = (onUploadSuccess: { (file: string | null): void }) => {
  const [uploadedFilePath, setUploadedFilePath] = useState('');

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/API/image_upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzExMzU1ODksInN1YiI6ImpvaG5fZG9lQGdtYWlsLmNvbSJ9.MHqLZEKKEgZlKATDecj6hiAxJXu4neBRzObQyY4Dfmw',
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

  // uploadImage upload to db
  return { uploadedFilePath, uploadImage, setUploadedFilePath };
};

export default useImageUpload;
