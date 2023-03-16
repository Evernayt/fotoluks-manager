function IconBinaryTree({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-binary-tree"
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
      <path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M7 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M21 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M12 8v8"></path>
      <path d="M6.316 12.496l4.368 -4.992"></path>
      <path d="M17.684 12.496l-4.366 -4.99"></path>
    </svg>
  );
}

export default IconBinaryTree;
