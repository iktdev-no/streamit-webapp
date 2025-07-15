import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { Catalog } from '../../../types/content';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContentCover from './ContentCover';
import { isMobile } from 'react-device-detect';

interface HorizontalCatalogProps {
    title?: string;
    items?: Catalog[];
    onItemClick?: (item: Catalog) => void;
}

export default function HorizontalCatalog({ title, items, onItemClick }: HorizontalCatalogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        const checkOverflow = () => {
            if (el) {
                const overflow = el.scrollWidth > el.clientWidth;
                setHasOverflow(overflow);
            }
        };
        console.log("Er mobil:", isMobile);
        checkOverflow(); // initial sjekk

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [items]); // kjør på nytt når items endres

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDown(true);
        setStartX(e.pageX - scrollRef.current!.offsetLeft);
        setScrollLeft(scrollRef.current!.scrollLeft);
    };

    const handleMouseUpOrLeave = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return;
        const x = e.pageX - scrollRef.current!.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current!.scrollLeft = scrollLeft - walk;
    };

    const scrollBy = (distance: number) => {
        scrollRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
    };


    return (
        <Box className="scroller-container" sx={{
            position: 'relative'
        }}>
            {title && <Typography variant="h6" ml="64px" align='left' gutterBottom>{title}</Typography>}

            {/* ⬅️ Venstre knapp */}
            {hasOverflow && !isMobile && (
                <IconButton
                    onClick={() => scrollBy(-300)}
                    sx={{
                        position: 'absolute',
                        bottom: 3, // 👈 flytt ned
                        left: 0,
                        height: {
                            xs: 150,
                            sm: 200,
                            md: 245,
                        },
                        width: '48px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: '#080808ff',
                        borderRadius: '8px',
                        zIndex: 1,
                        '.scroller-container:hover &': {
                            opacity: 0.5,
                            pointerEvents: 'auto', // 🟢 aktiver interaksjon ved hover
                            '&:hover': {
                                opacity: 1,
                                backgroundColor: '#000000ff',
                            }
                        }
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ color: "white" }} fontSize="large" />
                </IconButton>
            )}

            {/* 🖼️ Horisontal scroller */}
            <Box
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onMouseMove={handleMouseMove}
                sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    cursor: isDown ? 'grabbing' : 'grab',
                    paddingLeft: (isMobile) ? 1: '52px',  // litt mer enn venstre knapp
                    paddingRight: (isMobile) ? 1: '52px',  // litt mer enn venstre knapp
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE 10+
                }}
            >
                {items?.map(item => (
                    <Box key={item.id} sx={{ flex: '0 0 auto' }}>
                        <ContentCover 
                            src={item.coverSrc}
                            alt={item.title}
                            draggable={false}
                            onClick={() => onItemClick?.(item)}
                        />
                    </Box>
                ))}
            </Box>

            {/* ➡️ Høyre knapp */}
            {hasOverflow && !isMobile && (
                <IconButton
                    onClick={() => scrollBy(300)}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 3, // 👈 flytt ned
                        height: {
                            xs: 150,
                            sm: 200,
                            md: 245,
                        },
                        width: '48px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: '#080808ff',
                        zIndex: 1,
                        borderRadius: '8px',
                        '.scroller-container:hover &': {
                            opacity: 0.5,
                            pointerEvents: 'auto', // 🟢 aktiver interaksjon ved hover
                            '&:hover': {
                                opacity: 1,
                                backgroundColor: '#000000ff',
                            }
                        }
                    }}
                >
                    <ArrowForwardIosIcon sx={{ color: "white" }} fontSize="large" />
                </IconButton>
            )}
        </Box>

    );
}
