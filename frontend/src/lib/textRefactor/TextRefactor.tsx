import React, { useRef, useState, useEffect } from "react";
import { Tooltip, Typography } from "@mui/material";

interface EllipsisTooltipProps {
  text: string;
  fontSize?: string;
}

const EllipsisTooltip: React.FC<EllipsisTooltipProps> = ({
  text,
  fontSize = "0.8rem",
}) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, [text]);

  return (
    <Tooltip
      title={isOverflowing ? text : ""}
      arrow
      disableInteractive>
      <Typography
        component="span"
        ref={textRef}
        sx={{
          fontSize,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
        }}>
        {text}
      </Typography>
    </Tooltip>
  );
};

export default EllipsisTooltip;
