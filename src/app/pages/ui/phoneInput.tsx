import * as React from "react";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./input"; // Adjust path to your Shadcn input
import { cn } from "./utils";

interface PhoneInputProps extends Omit<PatternFormatProps, "onChange"> {
  onChange?: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, ...props }, ref) => {
    return (
      <PatternFormat
        {...props}
        format="(###) ###-####"
        mask="_"
        customInput={Input} // This forces it to use your Shadcn styling
        className={cn("flex-1", className)}
        getInputRef={ref}
        onValueChange={(values) => {
          // values.value returns just the digits (e.g., "5551234567")
          // We prepend +1 for your backend identity matching
          onChange?.(values.value ? `+1${values.value}` : "");
        }}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";
