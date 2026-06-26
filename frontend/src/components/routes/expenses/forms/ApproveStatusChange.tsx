import { Box } from "@mui/material";
import { ExpanseStatusEnum } from "../../../../types/enums/ExpanseStatusEnum.tsx";
import { useTranslation } from "react-i18next";

interface properties {
  newOperation: ExpanseStatusEnum;
}

const ApproveStatusChange = (props: properties) => {
  const { t } = useTranslation("expenses");

  const statusLabel =
    props.newOperation === ExpanseStatusEnum.PLANNED
      ? t("status.planned")
      : props.newOperation === ExpanseStatusEnum.APPROVED
        ? t("status.approved")
        : props.newOperation === ExpanseStatusEnum.NORMAL
          ? t("status.normal")
          : t("approve.unknownStatus");

  return (
    <Box>
      {t("approve.prompt")} <strong> {statusLabel} </strong>?
    </Box>
  );
};

export default ApproveStatusChange;
