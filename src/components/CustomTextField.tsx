import { TextField, type TextFieldProps } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomTextField = ({ name, label, value, onChange, ...rest }: CustomTextFieldProps) => {
    return (
        <TextField
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            variant="outlined"
            fullWidth
            {...rest}
        />
    );
};

export default CustomTextField;
