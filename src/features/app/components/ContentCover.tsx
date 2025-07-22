import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectServerState } from "../store/serverSlice";
import { getSecureUrl } from "../utils";

interface Props {
    src?: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<Theme>;
    draggable?: boolean;
    recent?: boolean;
    onClick?: () => void;
}

export const defaultSize = {
        width: { xs: 100, sm: 120, md: 160 },
        height: { xs: 150, sm: 200, md: 240 }
    };


export default function CoverImage({
    src,
    alt,
    className,
    style,
    sx,
    draggable,
    recent,
    onClick
}: Props) {
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const [imageError, setImageError] = useState(false);

    const url = src ? getSecureUrl(src, serverState, token) : "";


    return (
        <Box
            onClick={onClick}
            className={className}
            style={style}
            sx={{
                position: 'relative', // 👈 viktig!
                borderRadius: "8px",
                zIndex: 0,
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                backgroundColor: imageError || !url ? 'primary.dark' : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden", // hvis overlay stikker ut
                ...defaultSize,
                ...sx
            }}
        >
            {/* 🔮 Overlay-element */}
            {recent && (
                <Box
                    sx={{
                        position: "absolute",
                        display: "flex",
                        top: 10,
                        left: 0,
                        backgroundColor: "magenta",
                        zIndex: 1
                    }}
                >
                    <Typography sx={{ margin: 0, paddingLeft: 0.5, paddingRight: 0.5, color: 'text.primary', backgroundColor: 'secondary.main' }}>Ny</Typography>
                    <Typography sx={{ margin: 0, paddingLeft: 0.5, paddingRight: 0.5, color: 'secondary.main', backgroundColor: 'text.primary' }}>Episode</Typography>
                </Box>
            )}

            {/* 📷 Bildet */}
            {!imageError && url ? (
                <Box
                    component="img"
                    src={url}
                    alt={alt}
                    draggable={draggable ?? false}
                    onError={() => setImageError(true)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit"
                    }}
                />
            ) : (
                <Box
                    sx={{
                        color: 'text.primary',
                        fontSize: "0.85rem",
                        textAlign: "center",
                        px: 1,
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                    }}
                >
                    {alt ?? "Ugyldig bilde"}
                </Box>
            )}
        </Box>

    );
}
