import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

const NKInfoIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} fontSize="large">
      <svg
        viewBox="-4.8 -4.8 33.60 33.60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12 17V11"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>{" "}
          <circle
            cx="1"
            cy="1"
            r="1"
            transform="matrix(1 0 0 -1 11 9)"
            fill="#ffffff"
          ></circle>{" "}
          <path
            d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
            stroke="#ffffff"
            strokeWidth="1.5"
          ></path>{" "}
        </g>
      </svg>
    </SvgIcon>
  );
};

export default NKInfoIcon;
