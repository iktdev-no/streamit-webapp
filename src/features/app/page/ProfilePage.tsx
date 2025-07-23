import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Profile } from "../../../types/profile";
import { Profiles } from "../api/Get";
import { UpdateOrCreateProfile } from "../api/Post";
import Header from "../components/Header";
import ProfilesRender from "../components/ProfilesRender";
import { setProfile } from "../store/appSlice";

interface ProfilePageProps {
}

export default function ProfilePage({ }: ProfilePageProps) {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        Profiles().then(setProfiles).finally(() => setLoading(false))
    }, [])

    const onSelectProfile = (profile: Profile) => {
        dispatch(setProfile(profile))
        navigate("/");
    }

    const onCreateProfile = (profile: Profile) => {
        UpdateOrCreateProfile(profile).then((success) => {
            if (success) {
                setLoading(true);
                Profiles().then(setProfiles).finally(() => setLoading(false));
            }
        })
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header
                title="Velg profil"
                onBackClicked={() => { navigate(-1); }}
            />
            {loading ? (
                <p>Laster profiler…</p>
            ) : (
                <Box sx={{ paddingTop: "64px", height: "100%" }}>
                    <ProfilesRender
                        profiles={profiles}
                        onSelectProfile={onSelectProfile}
                        onCreateProfile={onCreateProfile} />
                </Box>
            )}
        </Box>
    );
}