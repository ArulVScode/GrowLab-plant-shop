const VARIANTS = {
  primary: "nb-btn-primary",
  accent: "nb-btn-accent",
  dark: "nb-btn-dark",
  outline: "nb-btn-outline",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  children,
  ...props
}) {
  const sizeClass = size === "sm" ? "!px-4 !py-2 !text-sm" : size === "lg" ? "!px-7 !py-4 !text-base" : "";
  return (
    <Comp className={`${VARIANTS[variant]} ${sizeClass} ${className}`} {...props}>
      {Icon && iconPosition === "left" && <Icon size={18} strokeWidth={2.5} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} strokeWidth={2.5} />}
    </Comp>
  );
}
