import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Webcam from 'react-webcam';

export type FaceRecognitionHandle = {
  isCaptured: () => boolean;
  getImage: () => string | null;
};

interface FaceRecognitionProps {
  mode?: 'signup' | 'signin';
  onVerified?: () => void;
}

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: 'user'
};

const FaceRecognition = forwardRef<FaceRecognitionHandle, FaceRecognitionProps>(({ mode = 'signup', onVerified }, ref) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onVerified?.();
    }
  };

  useImperativeHandle(ref, () => ({
    isCaptured: () => !!capturedImage,
    getImage: () => capturedImage
  }));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      mt={3}
      sx={{
        backgroundColor: '#f5faff',
        padding: 3,
        borderRadius: 2,
        maxWidth: 400,
        margin: 'auto'
      }}
    >
      <Typography variant="h6" textAlign="center">
        {mode === 'signin' ? 'Face Verification' : 'Register Your Face'}
      </Typography>

      <Box
        sx={{
          width: 320,
          height: 240,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured face"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box display="flex" gap={2}>
        {capturedImage ? (
          <Button variant="outlined" onClick={() => setCapturedImage(null)}>
            Retake Photo
          </Button>
        ) : (
          <Button variant="contained" onClick={capture}>
            Capture Photo
          </Button>
        )}
      </Box>
    </Box>
  );
});

export default FaceRecognition;
