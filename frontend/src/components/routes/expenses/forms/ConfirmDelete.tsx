import { Box } from "@mui/material";

interface properties {
  multi?: boolean;
}

const ConfirmDelete = (props: properties) => {
  return (
    <Box>Czy potwierdzasz usunięcie {props.multi ? "wydatków" : "wydatku"}</Box>
  );
};

export default ConfirmDelete;
