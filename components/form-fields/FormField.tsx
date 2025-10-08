import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  render: (props: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
  }) => React.ReactElement;
}

/**
 * Wrapper component that integrates react-hook-form's Controller
 * with custom form field components
 */
export default function FormField<T extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) =>
        render({
          value,
          onChange,
          onBlur,
          error: error?.message,
        })
      }
    />
  );
}
