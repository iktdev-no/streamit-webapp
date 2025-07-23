import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import type { Profile, RemoteImage } from "../../../types/profile";
import { GetProfileImages } from "../api/Get";
import ImagePicker from "./ImagePicker";

export interface ProfileProps {
    profiles: Profile[];
    onSelectProfile: (profile: Profile) => void;
    onCreateProfile: (profile: Profile) => void; // Optional callback for creating a new profile
}

export default function ProfilesRender({ profiles, onSelectProfile, onCreateProfile }: ProfileProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    return (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap", placeContent: "center", height: "100%" }}>
                <Grid container spacing={4} sx={{ marginTop: 5, marginBottom: 5 }}>
                    {profiles.map((item, index) => (
                        <Grid key={index} size={6}>
                            <Box
                                onClick={() => onSelectProfile(item)}
                                sx={{
                                    display: "flex",
                                    width: 150,
                                    margin: "auto",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",

                                }}>
                                <img height={150} width={150} src={item.imageSrc!} />
                                <Typography variant="h5">{item.name}</Typography>
                            </Box>
                        </Grid>
                    ))}
                    <Grid size={6}>
                        <Box
                            onClick={() => setShowCreateModal(true)}
                            sx={{
                                height: 150,
                                width: 150,
                                border: "2px dashed #aaa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                borderRadius: 2,
                                margin: "auto"
                            }}
                        >
                            <Typography color="text.secondary">+ Ny profil</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <CreateProfileModal
                open={showCreateModal} // This should be controlled by a state in the parent component
                onClose={() => setShowCreateModal(false)} // This should also be controlled by a state in the parent component
                onCreate={onCreateProfile}
            />
        </>
    )
}


interface CreateProfileModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (profile: Profile) => void;
}
function CreateProfileModal({ open, onClose, onCreate }: CreateProfileModalProps) {
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string>();

    const [selectedImage, setSelectedImage] = useState<RemoteImage | null>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [images, setImages] = useState<RemoteImage[]>([]); // This should be populated with available profile images
    useEffect(() => {
        GetProfileImages().then((images) => {
            setImages(images);
        }).catch((error) => {
            console.error("Failed to fetch profile images:", error);
        });
    }, [open]);

    useEffect(() => {
        setImage(selectedImage?.image)
    }, [selectedImage])

    const handleCreate = () => {
        if (name && image) {
            const newProfile: Profile = {
                guid: uuidv4(),
                name: name,
                image: image,
                imageSrc: null
            };
            onCreate(newProfile);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Ny profil</DialogTitle>
            <DialogContent>
                <Box sx={{
                    marginBottom: 5
                }}>
                    <Box
                        sx={{
                            width: 150,
                            height: 150,
                            border: (!selectedImage) ? '2px dashed #aaa' : '2px solid #aaa',
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            mx: 'auto',
                            overflow: 'hidden',
                            marginBottom: 5
                        }}
                        onClick={() => setShowImagePicker(true)} // åpner imagePicker-modus
                    >
                        {selectedImage?.imageSrc ? (
                            <img src={selectedImage.imageSrc} alt="Valgt bilde" width="100%" height="100%" style={{ objectFit: 'cover' }} />
                        ) : (
                            <AddIcon fontSize="large" sx={{ color: '#aaa' }} />
                        )}
                    </Box>
                    {/* Du kan legge inn bildeopplasting her */}
                    {showImagePicker && (
                        <ImagePicker
                            images={images}
                            selected={selectedImage}
                            onSelect={(image) => {
                                setSelectedImage(image);
                                setShowImagePicker(false); // lukker velgeren etter valg
                            }}
                        />
                    )}
                </Box>
                <TextField
                    label="Navn"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Avbryt</Button>
                <Button onClick={handleCreate} variant="contained">Opprett</Button>
            </DialogActions>
        </Dialog>
    );
}