import { ChangeOptionEnum } from "../../types/enums/ChangeOptionsEnum.tsx";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useDialog } from "../../lib/dialog/NKDialogContext.tsx";
import NKDeleteResetDataForm from "./NKDeleteResetDataForm.tsx";
import NKResetSelectedCategoriesForm from "./NKResetSelectedCategoriesForm";

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

  useEffect(() => {
    switch (props.changeOption) {
      case ChangeOptionEnum.RESET_DATA:
        setLabels({
          label: "Resetuj wszystkie dane",
          stepsInfo:
            "Zostaniesz poproszony o podanie swojego maila, oraz hasła w celu potwierdzenia usunięcia danych",
          buttonTitle: "Potwierdzam usunięcie danych",
          info: "Wszystkie twoje dane: uzupełnione budżety, wprowadzone wydatki, zapisane kategorie, zostaną usunięte. Będziesz mógł zacząć prowadzić swoje konto na nowo. Jeżeli chcesz zresetować dane tylko z konkretnych kategorii, wybierz opcję, resetuj wybrane kategorie",
        });

        break;
      case ChangeOptionEnum.RESET_CATEGORIES:
        setLabels({
          label: "Resetuj dane z wybranych kategorii",
          stepsInfo:
            "Wybierz kategorie, dla których chcesz usunąć dane:",
          info: "Dane dotyczące zaznaczonych kategorii zostaną usunięte:",
          buttonTitle: "Potwierdzam usunięcie danych z wybranych kategorii",
        });
        break;
      default:
    }
  }, [props.changeOption]);

  const handleOpenDialog = () => {
    if (props.changeOption === ChangeOptionEnum.RESET_DATA) {
      const formId = "reset-data-form";
      openDialog(
        {
          title: "Potwierdź reset danych",
          saveButtonTitle: "Potwierdzam",
          cancelButtonTitle: "Anuluj",
          formId,
        },
        <NKDeleteResetDataForm formId={formId} mode="reset-data" />,
      );
      return;
    }

    if (props.changeOption === ChangeOptionEnum.RESET_CATEGORIES) {
      const formId = "reset-categories-form";
      openDialog(
        {
          title: "Potwierdź reset kategorii",
          saveButtonTitle: "Potwierdzam",
          cancelButtonTitle: "Anuluj",
          formId,
        },
        <NKResetSelectedCategoriesForm formId={formId} />,
      );
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {labels.label}
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: "red" }}>
        {labels.info}
      </Typography>
      <Divider sx={{ marginBottom: 2, marginTop: 4 }} />
      <Typography variant="caption" gutterBottom sx={{ color: "red" }}>
        {labels.stepsInfo}
      </Typography>
      <Divider sx={{ marginBottom: 4, marginTop: 2 }} />
      <Button
        fullWidth
        sx={{ marginBottom: 1 }}
        variant="contained"
        color="error"
        onClick={handleOpenDialog}
      >
        {labels.buttonTitle}
      </Button>
    </>
  );
};

export default NKResetData;
