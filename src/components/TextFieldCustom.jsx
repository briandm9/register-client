import { TextField } from "@mui/material";

export function TextFieldCustom({ ...props }) {
  return (
    <TextField
      fullWidth
      margin="normal"
      required={true}
      {...props}
    />
  );
}
