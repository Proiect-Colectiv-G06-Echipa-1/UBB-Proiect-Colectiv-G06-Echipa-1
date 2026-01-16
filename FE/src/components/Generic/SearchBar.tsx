import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fontFamilyStyle } from '../../lib/style';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <TextField
    variant="outlined"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder || 'Search...'}
    size="small"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      style: { ...fontFamilyStyle, background: '#fff', borderRadius: 8 }
    }}
    sx={{ minWidth: 250 }}
  />
);

export default SearchBar;
