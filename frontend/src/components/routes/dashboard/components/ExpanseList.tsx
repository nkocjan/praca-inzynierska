import { List, ListItem, Typography, Paper } from "@mui/material";
import EllipsisTooltip from "../../../../lib/textRefactor/TextRefactor";
import { ExpenseUiDTO } from "../../../../api/generated";

interface ExpenseListProperties {
  height?: number | string;
  expenses: ExpenseUiDTO[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
};

const ExpenseList = (props: ExpenseListProperties) => {
  return (
    <Paper
      sx={{
        padding: 1,
        color: "white",
        maxWidth: 350,
        maxHeight: 300,
        overflow: "hidden",
        height: props.height,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          marginBottom: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <EllipsisTooltip text="Ostatnie wydatki" fontSize="1rem" />
      </Typography>
      <List sx={{ maxHeight: 250, overflowY: "auto" }}>
        {props.expenses?.map((expense) => (
          <ListItem
            key={expense.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                flexGrow: 1,
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* Zakładam, że DTO ma pole 'name' lub 'category' */}
              <EllipsisTooltip text={expense.name || "Brak nazwy"} />
            </Typography>

            <Typography
              sx={{
                flexShrink: 0,
                minWidth: "80px",
                textAlign: "right",
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {/* Formatujemy kwotę z DTO */}
              {formatCurrency(expense.amount as number)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseList;
