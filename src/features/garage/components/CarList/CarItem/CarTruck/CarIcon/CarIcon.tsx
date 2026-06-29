import type { ReactNode } from 'react';
import React from 'react';

interface CarIconProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;
const RGB_COLOR_REGEX = /^rgb/;

function isValidColor(color: string): boolean {
  if (!color) return false;
  if (HEX_COLOR_REGEX.test(color)) return true;
  if (RGB_COLOR_REGEX.test(color)) return true;
  return false;
}

function CarIcon({
  color = '#000000',
  width = '60',
  height = '60',
}: CarIconProps): ReactNode {
  const validColor = isValidColor(color) ? color : '#000000';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 256 256"
      xmlSpace="preserve"
    >
      <g
        style={SVG_STYLES.group}
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
      >
        <circle cx="70.735" cy="56.775" r="1.955" style={SVG_STYLES.wheels} />
        <circle cx="19.765" cy="56.775" r="1.955" style={SVG_STYLES.wheels} />
        <path
          d={CAR_CHASSIS_PATH}
          style={{ ...SVG_STYLES.chassis, fill: validColor }}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const CAR_CHASSIS_PATH =
  'M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z';

const SVG_STYLES = {
  group: {
    stroke: 'none',
    strokeWidth: 0,
    strokeDasharray: 'none',
    strokeLinecap: 'butt' as const,
    strokeLinejoin: 'miter' as const,
    strokeMiterlimit: 10,
    fill: 'none',
    fillRule: 'nonzero' as const,
    opacity: 1,
  },
  wheels: {
    stroke: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    strokeLinecap: 'butt' as const,
    strokeLinejoin: 'miter' as const,
    strokeMiterlimit: 10,
    fill: 'rgb(0,0,0)',
    fillRule: 'nonzero' as const,
    opacity: 1,
  },
  chassis: {
    stroke: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    strokeLinecap: 'butt' as const,
    strokeLinejoin: 'miter' as const,
    strokeMiterlimit: 10,
    fillRule: 'nonzero' as const,
    opacity: 1,
  },
};

export default React.memo(CarIcon);
