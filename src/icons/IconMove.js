function IconMove({ size = 24, color = 'currentColor', stroke = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-switch-horizontal"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M16 3l4 4l-4 4"></path>
      <path d="M10 7l10 0"></path>
      <path d="M8 13l-4 4l4 4"></path>
      <path d="M4 17l9 0"></path>
    </svg>
  );
}

export default IconMove;
