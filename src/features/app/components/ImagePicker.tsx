import { Box } from "@mui/material";
import type { RemoteImage } from "../../../types/profile";

interface ImagePickerProps {
  images: RemoteImage[]; // array med imageSrc-strenger
  selected: RemoteImage | null;
  onSelect: (image: RemoteImage) => void;
}

export default function ImagePicker({ images, selected, onSelect }: ImagePickerProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {images.filter(i => i.imageSrc).map((src, i) => (
        <Box
          key={i}
          onClick={() => onSelect(src)}
          sx={{
            border: selected === src ? '3px solid #007bff' : '2px solid #ccc',
            borderRadius: 2,
            cursor: 'pointer',
            padding: 0.5
          }}
        >
          <img src={src.imageSrc!} alt={`Option ${i}`} width={80} height={80} />
        </Box>
      ))}
    </Box>
  );
};
