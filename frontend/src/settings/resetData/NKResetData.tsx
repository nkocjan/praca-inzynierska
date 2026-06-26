import { ChangeOptionEnum } from "../../types/enums/ChangeOptionsEnum.tsx";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useDialog } from "../../lib/dialog/useDialog";
import NKDeleteResetDataForm from "./NKDeleteResetDataForm.tsx";
import NKResetSelectedCategoriesForm from "./NKResetSelectedCategoriesForm";
import { useTranslation } from "react-i18next";

interface properties {
  changeOption: ChangeOptionEnum;
}

interface labels {
  label: string;
  info: string;
  stepsInfo: string;
  buttonTitle: string;
}

const NKResetData = (props: properties) => {
  const [labels, setLabels] = useState<labels>({
    info: "",
    label: "",
    buttonTitle: "",
    stepsInfo: "",
  });
  const { openDialog } = useDialog();
  const { t } = useTranslation("settings");

  useEffect(() => {
    switch (props.changeOption) {
      case ChangeOptionEnum.RESET_DATA:
        setLabels({
          label: t("resetData.resetAll.label"),
          stepsInfo: t("resetData.resetAll.stepsInfo"),
          buttonTitle: t("resetData.resetAll.buttonTitle"),
          info: t("resetData.resetAll.info"),
        });

        break;
      case ChangeOptionEnum.RESET_CATEGORIES:
        setLabels({
          label: t("resetData.resetCategories.label"),
          stepsInfo: t("resetData.resetCategories.stepsInfo"),
          info: t("resetData.resetCategories.info"),
          buttonTitle: t("resetData.resetCategories.buttonTitle"),
        });
        break;
      default:
    }
  }, [props.changeOption, t]);

  const handleOpenDialog = () => {
    if (props.changeOption === ChangeOptionEnum.RESET_DATA) {
      const formId = "reset-data-form";
      openDialog(
        {
          title: t("resetData.resetAll.dialogTitle"),
          saveButtonTitle: t("resetData.dialog.confirm"),
          cancelButtonTitle: t("resetData.dialog.cancel"),
          formId,
        },
        <NKDeleteResetDataForm
          formId={formId}
          mode="reset-data"
        />,
      );
      return;
    }

    if (props.changeOption === ChangeOptionEnum.RESET_CATEGORIES) {
      const formId = "reset-categories-form";
      openDialog(
        {
          title: t("resetData.resetCategories.dialogTitle"),
          saveButtonTitle: t("resetData.dialog.confirm"),
          cancelButtonTitle: t("resetData.dialog.cancel"),
          formId,
        },
        <NKResetSelectedCategoriesForm formId={formId} />,
      );
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom>
        {labels.label}
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "red" }}>
        {labels.info}
      </Typography>
      <Divider sx={{ marginBottom: 2, marginTop: 4 }} />
      <Typography
        variant="caption"
        gutterBottom
        sx={{ color: "red" }}>
        {labels.stepsInfo}
      </Typography>
      <Divider sx={{ marginBottom: 4, marginTop: 2 }} />
      <Button
        fullWidth
        sx={{ marginBottom: 1 }}
        variant="contained"
        color="error"
        onClick={handleOpenDialog}>
        {labels.buttonTitle}
      </Button>
    </>
  );
};

export default NKResetData;
