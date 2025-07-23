import AddIcon from '@mui/icons-material/Add';
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Profile, RemoteImage } from "../../../types/profile";
import { GetProfileImages } from "../api/Get";
import { UpdateOrCreateProfile } from "../api/Post";
import Header from "../components/Header";
import ImagePicker from "../components/ImagePicker";
import { selectProfile, setProfile } from "../store/appSlice";


interface ProfileEditPageProps {

}

export default function ProfileEditPage({ }: ProfileEditPageProps) {
    const [name, setName] = useState<string>("");

    const [showImagePicker, setShowImagePicker] = useState(false);
    const [images, setImages] = useState<RemoteImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<RemoteImage | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        GetProfileImages().then((images) => {
            setImages(images);
        }).catch((error) => {
            console.error("Failed to fetch profile images:", error);
        });
    }, [open]);

    const profile = useSelector(selectProfile)

    useEffect(() => {
        setName(profile?.name ?? '')
        const matchingImage = images.find((value) => value.image === profile?.image)
        if (matchingImage) {
            setSelectedImage(matchingImage)
        } else {
            if (profile?.image && profile?.imageSrc) {
                setSelectedImage({
                    image: profile?.image,
                    imageSrc: profile?.imageSrc
                })
            }
        }
    }, [profile, images])

    const onUpdateProfile = () => {
        if (!profile || !selectedImage) return
        const updateProfile: Profile = {
            guid: profile.guid,
            name: name,
            image: selectedImage?.image,
            imageSrc: selectedImage?.imageSrc
        }
        UpdateOrCreateProfile(updateProfile).then((success) => {
            dispatch(setProfile(updateProfile))
        }).finally(() => { })
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header
                title="Velg profil"
                onBackClicked={() => { navigate(-1); }}
            />
            <Box sx={{
                paddingTop: "64px",
                display: "flex",
                flexWrap: "wrap", placeContent: "center",
                flexDirection: "column",
                marginTop: "auto",
                marginBottom: "auto"
            }}>
                <Box sx={{
                    width: {
                        xs: '100%', // små skjermer
                        md: '75%',  // medium skjermer
                        lg: '50%',  // store skjermer
                    },
                    marginTop: 5,
                    marginBottom: 5
                }}>
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
                </Box>
                <Button onClick={onUpdateProfile} variant="contained">Oppdater</Button>
            </Box>
        </Box>

    )
}