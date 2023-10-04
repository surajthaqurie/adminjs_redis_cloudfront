export const margin = (top: number, right: number, bottom: number, left: number, unit: string): { margin: string } => {
  return {
    margin: `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`
  };
};

export const requiredField = {
  color: "#4268F6"
};

export const errorColor = {
  color: "#FF4567"
};
