function IconCloudDownload({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-cloud-download"
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
      <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4"></path>
      <path d="M12 13l0 9"></path>
      <path d="M9 19l3 3l3 -3"></path>
    </svg>
  );
}

export default IconCloudDownload;
