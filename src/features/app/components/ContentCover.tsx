import { Box, type SxProps, type Theme } from "@mui/material";
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
    onClick?: () => void;
}

export default function CoverImage({
    src,
    alt,
    className,
    style,
    sx,
    draggable,
    onClick
}: Props) {
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const [imageError, setImageError] = useState(false);

    const url = src ? getSecureUrl(src, serverState, token) : "";

    const defaultSize = {
        width: { xs: 100, sm: 120, md: 160 },
        height: { xs: 150, sm: 200, md: 240 }
    };

    return (
        <Box
            onClick={onClick}
            className={className}
            style={style}
            sx={{
                borderRadius: "8px",
                zIndex: 1,
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                backgroundColor: imageError || !url ? 'primary.dark' : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...defaultSize,
                ...sx
            }}
        >
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
                        borderRadius: "inherit",

                    }}
                />
            ) : (
                <Box
                    sx={{
                        color: 'text.primary',
                        fontSize: "0.85rem",
                        textAlign: "center",
                        px: 1, // gir litt padding i bredden
                        wordBreak: "break-word", // tvinger lange ord til å brytes
                        overflowWrap: "break-word" // ekstra støtte
                    }}
                >
                    {alt ?? "Ugyldig bilde"}
                </Box>

            )}
        </Box>
    );
}
