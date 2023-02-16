function IconArrowBarToDown({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrow-bar-to-down"
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
      <path d="M4 20l16 0"></path>
      <path d="M12 14l0 -10"></path>
      <path d="M12 14l4 -4"></path>
      <path d="M12 14l-4 -4"></path>
    </svg>
  );
}

export default IconArrowBarToDown;
