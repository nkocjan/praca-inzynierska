import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { GridSlotProps } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import GridEmptyState from "../../../../lib/grid/GridEmptyState";

const ExpensesEmptyState = ({ filtered, onReset }: GridSlotProps["noRowsOverlay"]) => {
  const { t } = useTranslation(["expenses", "common"]);

  return (
    <GridEmptyState
      icon={<ReceiptLongOutlinedIcon />}
      title={t("empty.title")}
      text={filtered ? t("empty.filtered") : t("empty.none")}
      actionLabel={filtered ? t("common:filters.clear") : undefined}
      onAction={onReset}
    />
  );
};

export default ExpensesEmptyState;
