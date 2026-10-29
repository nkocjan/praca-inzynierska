import Grid from "@mui/material/Grid2";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const NKInformation = () => {
  const { t } = useTranslation("information");

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid size={12}>
        <Typography
          variant="h4"
          gutterBottom>
          {t("title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary">
          {t("description")}
        </Typography>
      </Grid>

      <Grid size={12}>
        <Paper
          variant="outlined"
          sx={{ p: 2 }}>
          <Typography
            variant="h5"
            gutterBottom>
            {t("usage.title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List dense>
            <ListItem>
              <ListItemText
                primary={t("usage.items.register.primary")}
                secondary={t("usage.items.register.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("usage.items.categories.primary")}
                secondary={t("usage.items.categories.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("usage.items.budgets.primary")}
                secondary={t("usage.items.budgets.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("usage.items.expenses.primary")}
                secondary={t("usage.items.expenses.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("usage.items.dashboard.primary")}
                secondary={t("usage.items.dashboard.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("usage.items.settings.primary")}
                secondary={t("usage.items.settings.secondary")}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid size={12}>
        <Paper
          variant="outlined"
          sx={{ p: 2 }}>
          <Typography
            variant="h5"
            gutterBottom>
            {t("technical.title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body1"
            gutterBottom>
            {t("technical.intro")}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom>
              {t("technical.systemPartsTitle")}
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.frontend.primary")}
                  secondary={t("technical.parts.frontend.secondary")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.bff.primary")}
                  secondary={t("technical.parts.bff.secondary")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.userService.primary")}
                  secondary={t("technical.parts.userService.secondary")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.budgetService.primary")}
                  secondary={t("technical.parts.budgetService.secondary")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.expenseService.primary")}
                  secondary={t("technical.parts.expenseService.secondary")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("technical.parts.databases.primary")}
                  secondary={t("technical.parts.databases.secondary")}
                />
              </ListItem>
            </List>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary">
            {t("technical.security")}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={12}>
        <Paper
          variant="outlined"
          sx={{ p: 2 }}>
          <Typography
            variant="h5"
            gutterBottom>
            {t("technologies.title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="subtitle1"
            gutterBottom>
            {t("technologies.frontendTitle")}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.react.primary")}
                secondary={t("technologies.frontend.react.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.vite.primary")}
                secondary={t("technologies.frontend.vite.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.mui.primary")}
                secondary={t("technologies.frontend.mui.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.axios.primary")}
                secondary={t("technologies.frontend.axios.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.formikYup.primary")}
                secondary={t("technologies.frontend.formikYup.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.notistack.primary")}
                secondary={t("technologies.frontend.notistack.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.frontend.chart.primary")}
                secondary={t("technologies.frontend.chart.secondary")}
              />
            </ListItem>
          </List>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ mt: 2 }}>
            {t("technologies.backendTitle")}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.java.primary")}
                secondary={t("technologies.backend.java.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.spring.primary")}
                secondary={t("technologies.backend.spring.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.security.primary")}
                secondary={t("technologies.backend.security.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.jpa.primary")}
                secondary={t("technologies.backend.jpa.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.feign.primary")}
                secondary={t("technologies.backend.feign.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.kafka.primary")}
                secondary={t("technologies.backend.kafka.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.mapstruct.primary")}
                secondary={t("technologies.backend.mapstruct.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.backend.openapi.primary")}
                secondary={t("technologies.backend.openapi.secondary")}
              />
            </ListItem>
          </List>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ mt: 2 }}>
            {t("technologies.infraTitle")}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={t("technologies.infra.postgres.primary")}
                secondary={t("technologies.infra.postgres.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.infra.docker.primary")}
                secondary={t("technologies.infra.docker.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.infra.maven.primary")}
                secondary={t("technologies.infra.maven.secondary")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("technologies.infra.generator.primary")}
                secondary={t("technologies.infra.generator.secondary")}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NKInformation;
