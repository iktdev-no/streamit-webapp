import { Box, type SxProps, type Theme } from "@mui/material";
import { useSelector } from "react-redux";
import { selectToken, selectServerState } from "../store/serverSlice";
import { getSecureUrl } from "../utils";

interface Props {
    src?: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<Theme>; // 👈 valgfritt override av styling
    draggable?: boolean; // for å forhindre at bildet kan dras
    onClick?: () => void
}

export default function CoverImage({ src, alt, className, style, sx, draggable, onClick }: Props) {
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);

    const url = getSecureUrl(src!, serverState, token);

    return (
        <Box
            component="img"
            onClick={onClick}
            src={url}
            alt={alt}
            className={className}
            draggable={draggable ?? false} // forhindrer at bildet kan dras
            style={style}
            sx={{
                objectFit: 'cover',
                borderRadius: "8px",
                zIndex: 1,
                width: {
                    xs: 100,
                    sm: 120,
                    md: 160,
                },
                height: {
                    xs: 150,
                    sm: 200,
                    md: 240,
                },
                userSelect: 'none', // hindrer tekstmarkering
                WebkitUserSelect: 'none', // Safari-støtte
                MozUserSelect: 'none', // Firefox-støtte
                msUserSelect: 'none', // IE-støtte
                ...sx
            }}
        />
    );
}
