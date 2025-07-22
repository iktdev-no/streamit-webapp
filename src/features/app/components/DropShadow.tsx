import { Box } from "@mui/material";

export interface DropShadowProps {
    height?: number
}

export default function DropShadow({height}: DropShadowProps) {
    return (
        <Box sx={{
            position: "absolute",
            top: 0,
            overflowX: "hidden",
            maxWidth: "100%",
            width: "100%",
                    zIndex: -2,

        }}>
            <Box
                sx={{
                    zIndex: -2,
                    marginLeft: "-50%",
                    width: "200%",
                    height: height ?? 600,
                    background: "radial-gradient(ellipse at top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 1) 60%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                }}
            />
        </Box>
    )
}