import { useEffect, useState } from "react"
import { Profiles } from "../api/Get"
import type { Profile } from "../../../types/profile";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import Grid from '@mui/material/Grid';
import { Box, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";
import { setProfile } from "../store/appSlice";


export default function ProfilePage({ canGoBack = true }: { canGoBack: boolean }) {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        Profiles().then(setProfiles).finally(() => setLoading(false))
    }, [])

    function onSelectProfile(profile: Profile) {
        dispatch(setProfile(profile))
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header
                title="Velg profil"
                onBackClicked={() => { console.log("Potet") }}
            />
            {loading ? (
                <p>Laster profiler…</p>
            ) : (
                <Box sx={{ paddingTop: "64px", display: "flex", flexWrap: "wrap", placeContent: "center", height: "100%" }}>
                    <Grid container spacing={4}>
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
                                onClick={() => console.log("Legg til ny profil")}
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
            )}
        </Box>
    );
}