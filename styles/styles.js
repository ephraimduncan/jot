import { blue, indigo, tomato, red } from "@radix-ui/colors";

export const commonStyle = {
  padding: "2rem",
  height: "100vh",
};

export const sidebarStyle = {
  ...commonStyle,
  background: tomato.tomato3,
  width: "25%",
  color: tomato.tomato11,
  borderRight: `1px solid ${blue.blue5}`,
  overflow: "auto",
};

export const mainSpaceStyle = {
  ...commonStyle,
  background: indigo.indigo3,
  width: "75%",
  color: indigo.indigo11,
};

export const listNoteStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignContent: "center",
  marginBottom: "1rem",
  cursor: "default",
  padding: "1rem",
  borderRadius: "6px",
  background: red.red4,
};
