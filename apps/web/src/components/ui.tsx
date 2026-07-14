import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { Children, isValidElement } from "react";
import * as RadixSelect from "@radix-ui/react-select";

function join(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      type={props.type ?? "button"}
      className={join(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-indigo-500 text-white hover:bg-indigo-400",
        variant === "secondary" &&
          "border border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-zinc-700",
        variant === "ghost" &&
          "bg-transparent text-zinc-300 hover:bg-zinc-900",
        variant === "danger" &&
          "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25",
        className,
      )}
      {...props}
    />
  );
}

export function Input(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string },
) {
  const { label, className, ...rest } = props;

  return (
    <label className="space-y-2">
      {label ? <span className="text-sm text-zinc-400">{label}</span> : null}
      <input
        className={join(
          "w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm outline-none",
          "placeholder:text-zinc-600 focus:border-indigo-500",
          className,
        )}
        {...rest}
      />
    </label>
  );
}

export function Textarea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="space-y-2">
      {label ? <span className="text-sm text-zinc-400">{label}</span> : null}
      <textarea
        className={join(
          "min-h-28 w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm outline-none",
          "placeholder:text-zinc-600 focus:border-indigo-500",
          className,
        )}
        {...props}
      />
    </label>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 10 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Select({
  label,
  className,
  children,
  value,
  onValueChange,
  placeholder,
  disabled,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const items = Children.toArray(children)
    .filter(isValidElement<{ value?: string; children?: ReactNode }>)
    .map((child) => ({
      value: String(child.props.value ?? ""),
      label: child.props.children,
    }));

  return (
    <label className="space-y-2">
      {label ? <span className="text-sm text-zinc-400">{label}</span> : null}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={join(
            "flex h-[46px] w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 text-sm text-zinc-100 outline-none transition",
            "data-[placeholder]:text-zinc-500 focus:border-indigo-500",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          aria-label={label}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="text-zinc-500">
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={8}
            className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40"
          >
            <RadixSelect.Viewport className="p-1">
              {items.map((item) => (
                <RadixSelect.Item
                  key={item.value}
                  value={item.value}
                  className="relative flex cursor-default select-none items-center rounded-lg py-2.5 pr-8 pl-3 text-sm text-zinc-200 outline-none transition focus:bg-zinc-900 focus:text-zinc-50 data-[state=checked]:bg-zinc-900"
                >
                  <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
                  <span className="absolute right-3 inline-flex items-center text-indigo-300">
                    <RadixSelect.ItemIndicator>
                      <CheckIcon />
                    </RadixSelect.ItemIndicator>
                  </span>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </label>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={join(
        "rounded-3xl border border-zinc-900 bg-zinc-950/85 shadow-2xl shadow-black/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/88 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-400">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
