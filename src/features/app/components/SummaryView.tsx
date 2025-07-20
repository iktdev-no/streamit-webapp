import { useEffect, useState } from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import type { Summary } from "../../../types/content";
import { getLanguageNameFromISO3 } from "../utils";

interface Props {
  summary: Summary[];
}

export default function SummaryView({ summary }: Props) {
  const [selectedLang, setSelectedLang] = useState(summary[0]?.language ?? "");

  const selected = summary.find(item => item.language === selectedLang);

  useEffect(() => {
    console.warn("Summary", summary)
  }, [summary])

  return (
    <Box>
      <Select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        {summary.map((item, i) => (
          <MenuItem key={i} value={item.language}>
            {getLanguageNameFromISO3(item.language)}
          </MenuItem>
        ))}
      </Select>

      {selected && (
        <>
          <Typography variant="body1">{selected.description}</Typography>
        </>
      )}
    </Box>
  );
}
