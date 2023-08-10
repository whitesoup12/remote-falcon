import { useState } from 'react';

import { Divider, FormControl, InputAdornment, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const FormControlSelect = ({ captionLabel, currencies, formState, iconPrimary, iconSecondary, selected, textPrimary, textSecondary }) => {
  const theme = useTheme();
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="small" sx={{ color: theme.palette.grey[700] }} /> : null;

  const IconSecondary = iconSecondary;
  const secondaryIcon = iconSecondary ? <IconSecondary fontSize="small" sx={{ color: theme.palette.grey[700] }} /> : null;

  const errorState = formState === 'error';
  const val = selected || '';

  const [currency, setCurrency] = useState(val);
  const handleChange = (event) => setCurrency(event?.target.value);

  return (
    <FormControl fullWidth error={errorState}>
      <TextField
        id="outlined-select-currency"
        select
        fullWidth
        label={captionLabel}
        value={currency}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <>
              {primaryIcon && <InputAdornment position="start">{primaryIcon}</InputAdornment>}
              {textPrimary && (
                <>
                  <InputAdornment position="start">{textPrimary}</InputAdornment>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </>
              )}
            </>
          ),
          endAdornment: (
            <>
              {secondaryIcon && <InputAdornment position="end">{secondaryIcon}</InputAdornment>}
              {textSecondary && (
                <>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <InputAdornment position="end">{textSecondary}</InputAdornment>
                </>
              )}
            </>
          )
        }}
      >
        {currencies?.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

FormControlSelect.propTypes = {
  captionLabel: PropTypes.string,
  currencies: PropTypes.array,
  formState: PropTypes.string,
  iconPrimary: PropTypes.object,
  iconSecondary: PropTypes.object,
  selected: PropTypes.string,
  textPrimary: PropTypes.string,
  textSecondary: PropTypes.string
};

export default FormControlSelect;
