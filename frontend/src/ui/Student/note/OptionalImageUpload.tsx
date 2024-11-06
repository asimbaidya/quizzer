import { useEffect, useRef } from 'react';
import { Box, Image, Text, Button } from '@chakra-ui/react';

// dependency
import useImage from './useImage';
import useCustomToast from '../../../hooks/useCustomToast';

interface ImageUploaderOptions {
  image: string | null | undefined;
  setFile: (file: string | null) => void;
  isVisible: boolean;
}

const OptionalImageUpload = ({
  image,
  setFile,
  isVisible,
}: ImageUploaderOptions) => {
  // so when new image uploading, this hook will update the new url
  // but if image is not null, this hook is not needed
  // so pass the image, if it's not already undefined,null or it should get rendered
  const { uploadedFilePath, uploadImage, setUploadedFilePath } =
    useImage(setFile);

  useEffect(() => {
    console.log('uploadedFilePath', uploadedFilePath);
    if (image) {
      const file_url: string = `http://127.0.0.1:8000/API/image_show/${image}`;
      setUploadedFilePath(file_url);
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useCustomToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  const handleBoxClick = () => {
    if (uploadedFilePath) {
      console.log('File Already Uploaded; Remove it first to add another');
      return;
    }

    if (fileInputRef.current) {
      // Trigger the file input click no need to click again
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setFile(null);
    setUploadedFilePath('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showToast({
      title: 'Image Removed',
      description: 'The image has been successfully removed.',
      status: 'warning',
    });
  };

  return (
    <Box
      border={uploadedFilePath ? 'none' : 'solid'}
      borderColor={uploadedFilePath ? 'transparent' : 'gray.400'}
      borderRadius={uploadedFilePath ? 'none' : 'md'}
      borderWidth={uploadedFilePath ? 'none' : '1px'}
      display={isVisible ? 'block' : 'none'}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box
        mt={4}
        minHeight={uploadedFilePath ? 'auto' : '50px'}
        maxWidth="800px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        onClick={handleBoxClick}
        cursor={uploadedFilePath ? 'unset' : 'pointer'}
        margin="auto"
      >
        {uploadedFilePath ? (
          <Box textAlign="center" position="relative">
            <Image
              src={uploadedFilePath}
              alt="Uploaded Image"
              objectFit="cover"
              boxSize="100%"
              borderRadius="md"
            />
            <Button
              position="absolute"
              top="5px"
              right="5px"
              colorScheme="red"
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          </Box>
        ) : (
          <Text
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="purple.500"
            fontStyle="italic"
            fontWeight="bold"
            fontSize={'xl'}
          >
            Add Optional Image
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default OptionalImageUpload;
