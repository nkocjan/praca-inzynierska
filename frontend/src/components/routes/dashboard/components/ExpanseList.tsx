import { List, ListItem, Typography, Paper } from "@mui/material";
import EllipsisTooltip from "../../../../lib/textRefactor/TextRefactor";
import { ExpenseUiDTO } from "../../../../api/generated";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";

interface ExpenseListProperties {
  height?: number | string;
  expenses: ExpenseUiDTO[];
}

const ExpenseList = (props: ExpenseListProperties) => {
  const { t, i18n } = useTranslation(["dashboard", "common"]);
  const language = normalizeLanguage(i18n.language);
  const hasExpenses = (props.expenses?.length || 0) > 0;

  return (
    <Paper
      sx={{
        padding: 1,
        color: "white",
        maxWidth: 350,
        maxHeight: 300,
        overflow: "hidden",
        height: props.height,
      }}>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          marginBottom: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
        <EllipsisTooltip
          text={t("dashboard:recentExpenses")}
          fontSize="1rem"
        />
      </Typography>
      {hasExpenses ? (
        <List sx={{ maxHeight: 250, overflowY: "auto" }}>
          {props.expenses.map(expense => (
            <ListItem
              key={expense.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}>
              <Typography
                sx={{
                  flexGrow: 1,
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                <EllipsisTooltip text={expense.name || t("dashboard:noName")} />
              </Typography>

              <Typography
                sx={{
                  flexShrink: 0,
                  minWidth: "80px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}>
                {formatCurrencyPLN(expense.amount as number, language)}
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", opacity: 0.9 }}>
          {t("common:noData")}
        </Typography>
      )}
    </Paper>
  );
};

export default ExpenseList;
