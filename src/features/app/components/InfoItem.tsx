import { Box, CardActionArea, Paper, Typography, type SxProps, type Theme } from "@mui/material";
import type { JSX } from "react";

type Variant = "default" | "info" | "update" | "warning";


export interface InfoItem {
  id: string;
  icon: JSX.Element;
  text: string;
  variant?: Variant;
  onClick?: () => void;
}

type Props = {
  sx?: SxProps<Theme>;
  items: InfoItem[];
  orientation?: "horizontal" | "vertical";
};

export function InfoList({ items, orientation, sx = {} }: Props) {
  const getLayoutStyle = (index: number, total: number): object => {
    if (index === 0) return {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    };
    if (index === total - 1) return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8
    };
    return { borderRadius: 0 };
  };


  const variantStyles: Record<Variant, SxProps> = {
    default: { backgroundColor: "primary.main", color: "text.primary" },
    info: { backgroundColor: "primary.main", color: "blue.900" },
    update: { backgroundColor: "orange", color: "orange.900" },
    warning: { backgroundColor: "primary.main", color: "red.800" },
  };

  const getDirectionStyle = (orientation?: "horizontal" | "vertical"): SxProps => {
    return orientation === "horizontal"
      ? { flexDirection: "row", flexWrap: "nowarp" }
      : { flexDirection: "column" };
  };

  return (
    <Box display="flex" sx={{
      ...getDirectionStyle(orientation),
      ...(Array.isArray(sx) ? Object.assign({}, ...sx) : sx),
    }} gap={0}>
      {items.map(({ id, icon, text, variant = "default", onClick }, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const layout = (orientation === "horizontal") ? {
          borderRadius: 2,
        } : getLayoutStyle(index, items.length)
        const style = variantStyles[variant ?? "default"];

        const wrapperLayout = (orientation === "horizontal") ? {
          borderRadius: 2,
          ml: isFirst ? 0 : 1,
          mr: isLast ? 0 : 1,
        } : {}

        return (
          <CardActionArea
            key={id}
            onClick={onClick}
            sx={{
              ...wrapperLayout
            }}
          >
            <Paper
              elevation={1}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: onClick ? "pointer" : "default",
                ...layout,
                ...style,
              }}
            >
              {icon}
              <Typography variant="body2">{text}</Typography>
            </Paper>
          </CardActionArea>
        );
      })}
    </Box>
  );
}
