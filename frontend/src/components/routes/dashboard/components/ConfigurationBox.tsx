import { Paper } from "@mui/material";

interface ConfigurationBoxProperties {
  height?: number | string;
}

const ConfigurationBox = (props: ConfigurationBoxProperties) => {
  return <Paper sx={{ height: props.height }}>FORMULARZ DO KONGIFURACJI</Paper>;
};

export default ConfigurationBox;
