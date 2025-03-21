import { Box } from "@mui/material";

interface properties {
  translation: string;
}

const ConfirmDelete = (props: properties) => {
  return <Box>Czy potwierdzasz usunięcie {props.translation}?</Box>;
};

export default ConfirmDelete;
