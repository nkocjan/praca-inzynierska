import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useState} from "react";

const NKLanguageSelect = () => {
    const [language, setLanguage] = useState('pl');

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
    };

    return <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Język</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={language}
            label="Język"
            onChange={handleChange}
        >
            <MenuItem value={"pl"}>Polish</MenuItem>
            <MenuItem value={"eng"}>English</MenuItem>
        </Select>
    </FormControl>
}

export default NKLanguageSelect;