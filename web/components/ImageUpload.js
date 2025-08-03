import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Image, SimpleGrid, Icon } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function ImageUpload({ onFilesAccepted, previews, setPreviews }) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    maxFiles: 3,
    onDrop: acceptedFiles => {
      onFilesAccepted(acceptedFiles);
      setPreviews(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const thumbs = previews.map(file => (
    <Box key={file.name} boxSize="100px" m={1} position="relative">
      <Image src={file.preview} alt={file.name} objectFit="cover" boxSize="100%" borderRadius="md" />
    </Box>
  ));

  return (
    <section>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <Icon as={AddIcon} w={8} h={8} color="gray.400" />
        <Text>Drag 'n' drop some files here, or click to select files (Max 3)</Text>
      </div>
      <SimpleGrid columns={3} spacing={2} mt={4}>
        {thumbs}
      </SimpleGrid>
    </section>
  );
}

export default ImageUpload;
