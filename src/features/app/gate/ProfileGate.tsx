import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { Profile } from "../../../types/profile";
import { Profiles } from "../api/Get";
import { UpdateOrCreateProfile } from "../api/Post";
import ProfilesRender from "../components/ProfilesRender";
import { setProfile } from "../store/appSlice";

export default function ProfileGate() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [, setLoading] = useState(true);
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