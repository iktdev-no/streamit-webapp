import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Collapse, IconButton, InputBase } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function HeaderSearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (!value) {
      setShowInput(false);
    }
  };

  const handleClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeSeacrh = () => {
    onChange("");
    setShowInput(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }


  useEffect(() => {
    if (!showInput && value.length > 0) {
      setShowInput(true)
    }
  }, [value])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {!showInput && (
        <IconButton
          edge="end"
          color="inherit"
          aria-label="search"
          onClick={handleClick}
        >
          <SearchIcon />
        </IconButton>
      )}

      <Collapse in={showInput} orientation="horizontal" timeout={300}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff33',
            padding: '2px 8px',
            borderRadius: 4,
            minWidth: 180,
          }}
        >
          <SearchIcon sx={{ color: 'white', marginRight: 1 }} />
          <InputBase
            inputRef={inputRef}
            placeholder="Søk..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            sx={{ color: 'white', width: '100%' }}
          />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="search"
            onClick={closeSeacrh}
            sx={{ padding: 0.2, marginRight: -0.5 }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Collapse>
    </div>
  );
}