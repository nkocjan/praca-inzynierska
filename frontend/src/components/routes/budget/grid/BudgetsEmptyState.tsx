import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { GridSlotProps } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import GridEmptyState from "../../../../lib/grid/GridEmptyState";

const BudgetsEmptyState = ({ filtered, onReset }: GridSlotProps["noRowsOverlay"]) => {
  const { t } = useTranslation(["budgets", "common"]);

  return (
    <GridEmptyState
      icon={<AccountBalanceWalletOutlinedIcon />}
      title={t("empty.title")}
      text={filtered ? t("empty.filtered") : t("empty.none")}
      actionLabel={filtered ? t("common:filters.clear") : undefined}
      onAction={onReset}
    />
  );
};

export default BudgetsEmptyState;
