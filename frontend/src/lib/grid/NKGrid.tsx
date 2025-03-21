import { ReactNode, useEffect, useState } from "react";
import { Paper, SxProps, Theme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

interface Properties {
  columns: GridColDef[];
  rows: Array<GridValidRowModel>;
  sort?: GridSortModel;
  sx?: SxProps<Theme>;
  filters?: ReactNode;
  onDelete?: (selectedIds: string[]) => void;
  isCheckboxOn?: boolean;
}

const NKGrid = (props: Properties) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCheckboxOn = props.isCheckboxOn ? true : false;

  const handleDeleteSelected = () => {
    if (props.onDelete) {
      props.onDelete(selectedRows as string[]);
    }
    setSelectedRows([]);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
        overflow: "hidden",
        ...props.sx,
      }}>
      {selectedRows.length > 0 && (
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            marginBottom: 1,
            padding: "4px 10px",
          }}>
          <Typography variant="subtitle1">
            Zaznaczono {selectedRows.length} wierszy
          </Typography>
          <IconButton
            onClick={handleDeleteSelected}
            color="error">
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      )}
      {selectedRows.length == 0 && props.filters}

      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        <DataGrid
          key={windowWidth}
          columns={props.columns}
          rows={props.rows}
          paginationModel={paginationModel}
          onPaginationModelChange={model => setPaginationModel(model)}
          initialState={{
            sorting: {
              sortModel: props.sort
                ? props.sort
                : [{ field: "name", sort: "desc" }],
            },
          }}
          onRowSelectionModelChange={newSelection =>
            setSelectedRows(newSelection)
          }
          pagination
          pageSizeOptions={[5, 10]}
          checkboxSelection={isCheckboxOn}
          disableRowSelectionOnClick
          sx={{ border: 0, height: "100%" }}
          disableColumnMenu
        />
      </div>
    </Paper>
  );
};

export default NKGrid;
