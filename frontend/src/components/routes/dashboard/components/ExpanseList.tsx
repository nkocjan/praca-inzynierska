import { List, ListItem, Typography, Paper } from "@mui/material";
import EllipsisTooltip from "../../../../lib/textRefactor/TextRefactor";

const expenses = [
  { id: 1, category: "jedzenie", amount: "345.33 zł" },
  { id: 2, category: "jedzenie", amount: "345.33 zł" },
  { id: 3, category: "mieszkanie", amount: "345.33 zł" },
  {
    id: 4,
    category: "zakupy i inne bardzo długie wydatki",
    amount: "345.33 zł",
  },
  { id: 5, category: "jedzenie", amount: "345.33 zł" },
];

interface ExpenseListProperties {
  height?: number | string;
}

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
          text="Ostatnie wydatki"
          fontSize="1rem"
        />
      </Typography>
      <List sx={{ maxHeight: 250, overflowY: "auto" }}>
        {expenses.map(expense => (
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
              <EllipsisTooltip text={expense.category} />
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
              {expense.amount}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseList;
