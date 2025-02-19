import { Box } from "@mui/material";
import { ExpanseStatusEnum } from "../../../../types/enums/ExpanseStatusEnum.tsx";

interface properties {
  newOperation: ExpanseStatusEnum;
}

const ApproveStatusChange = (props: properties) => {
  return (
    <Box>
      Czy na pewno chcesz ustawić nowy stan wydatku jako{" "}
      <strong> {props.newOperation} </strong> ?
    </Box>
  );
};

export default ApproveStatusChange;
