import { useRef } from 'react';
import { Box, Image, Text, Button } from '@chakra-ui/react';

// dependency
import useImageUpload from './useImageUpload';
import useCustomToast from '../../../hooks/useCustomToast';

interface ImageUploaderOptions {
  setFile: (file: string | null) => void;
}

const OptionalImageUpload = ({ setFile }: ImageUploaderOptions) => {
  const { uploadedFilePath, uploadImage, setUploadedFilePath } =
    useImageUpload(setFile);
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
      // console.log('File Already Uploaded; Remove it first to add another');
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
      status: 'warning',
    });
  };

  return (
    <Box
      border={uploadedFilePath ? 'none' : 'solid'}
      borderColor={uploadedFilePath ? 'transparent' : 'gray.100'}
      borderRadius={uploadedFilePath ? 'none' : 'md'}
      borderWidth={uploadedFilePath ? 'none' : '2px'}
      bg={uploadedFilePath ? 'none' : 'teal.500'}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box
        mt={4}
        minHeight={uploadedFilePath ? 'auto' : '200px'}
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
            color="teal.200"
            fontStyle="italic"
            fontWeight="bold"
            fontSize={{ base: '4xl', md: '6xl' }}
          >
            Add Optional Image
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default OptionalImageUpload;
