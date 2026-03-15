export function Button({ children, className, variant, asChild, ...props }) {
    const Comp = asChild ? props.as || "div" : "button"
    const variantClasses = {
      default: "bg-blue-600 hover:bg-blue-700 text-white",
      outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    }
  
    const baseClasses =
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  
    return (
      <Comp className={`${baseClasses} ${variantClasses[variant || "default"]} ${className || ""}`} {...props}>
        {children}
      </Comp>
    )
  }
  
  