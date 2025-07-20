import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { Profile } from "../../../types/profile";
import { Profiles } from "../api/Get";
import { setProfile } from "../store/appSlice";
import ProfilesRender from "../components/ProfilesRender";
import { UpdateOrCreateProfile } from "../api/Post";

export default function ProfileGate() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        Profiles().then(setProfiles).finally(() => setLoading(false))
    }, [])

    const onSelectProfile = (profile: Profile) => {
        dispatch(setProfile(profile))
    };

    const onCreateProfile = (profile: Profile) => {
        UpdateOrCreateProfile(profile).then((success) => {
            if (success) {
                setLoading(true);
                Profiles().then(setProfiles).finally(() => setLoading(false));
            }
        })
    }

    return (
        <ProfilesRender
            key={profiles.length}
            profiles={profiles}
            onSelectProfile={onSelectProfile}
            onCreateProfile={onCreateProfile}
        />

    )
}