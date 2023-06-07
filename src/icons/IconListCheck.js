function IconListCheck({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
      <path d="M3.5 5.5l1.5 1.5l2.5 -2.5"></path>
      <path d="M3.5 11.5l1.5 1.5l2.5 -2.5"></path>
      <path d="M3.5 17.5l1.5 1.5l2.5 -2.5"></path>
      <path d="M11 6l9 0"></path>
      <path d="M11 12l9 0"></path>
      <path d="M11 18l9 0"></path>
    </svg>
  );
}

export default IconListCheck;
