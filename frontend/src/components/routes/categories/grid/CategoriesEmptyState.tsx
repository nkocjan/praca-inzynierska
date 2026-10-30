import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { GridSlotProps } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import GridEmptyState from "../../../../lib/grid/GridEmptyState";

const CategoriesEmptyState = ({ filtered, onReset }: GridSlotProps["noRowsOverlay"]) => {
  const { t } = useTranslation(["categories", "common"]);

  return (
    <GridEmptyState
      icon={<CategoryOutlinedIcon />}
      title={t("empty.title")}
      text={filtered ? t("empty.filtered") : t("empty.none")}
      actionLabel={filtered ? t("common:filters.clear") : undefined}
      onAction={onReset}
    />
  );
};

export default CategoriesEmptyState;
