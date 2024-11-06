import { useEffect, useRef } from 'react';
import {
  Box,
  Image,
  IconButton,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

// dependency
import useImage from './useImage';
import useCustomToast from '../../../hooks/useCustomToast';
import { IMAGE_COLORS } from './flag_schemes';

interface ImageUploaderOptions {
  image: string | null | undefined;
  setFile: (file: string | null) => void;
  isVisible: boolean;
  flag: keyof typeof IMAGE_COLORS;
}

const OptionalImageUpload = ({
  image,
  setFile,
  isVisible,
  flag,
}: ImageUploaderOptions) => {
  const { uploadedFilePath, uploadImage, setUploadedFilePath } =
    useImage(setFile);

  useEffect(() => {
    if (image) {
      const file_url: string = `http://127.0.0.1:8000/API/image_show/${image}`;
      setUploadedFilePath(file_url);
    }
  }, [image, setUploadedFilePath]);

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
      return;
    }

    if (fileInputRef.current) {
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

  const removeButtonColor = useColorModeValue('red.500', 'red.300');
  const addButtonBgColor = useColorModeValue('gray.100', 'gray.700');
  const addButtonColor = useColorModeValue(
    IMAGE_COLORS[flag].light,
    IMAGE_COLORS[flag].dark
  );

  return (
    <Box
      px={4}
      my={4}
      display={isVisible ? 'block' : 'none'}
      border={uploadedFilePath ? 'solid' : 'none'}
      borderColor={uploadedFilePath ? addButtonColor : 'transparent'}
      borderRadius={uploadedFilePath ? 'md' : 'none'}
      borderWidth={uploadedFilePath ? '1px' : 'none'}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box
        mt={4}
        maxWidth="100%"
        py={4}
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
            <IconButton
              position="absolute"
              top="5px"
              right="5px"
              icon={<CloseIcon />}
              onClick={handleRemoveImage}
              aria-label="Remove Image"
              color={removeButtonColor}
            />
          </Box>
        ) : (
          <Tooltip label="Add Optional Image" aria-label="Add Optional Image">
            <IconButton
              icon={<AddIcon />}
              aria-label="Add Optional Image"
              bg={addButtonBgColor}
              color={addButtonColor}
              size="lg"
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default OptionalImageUpload;
