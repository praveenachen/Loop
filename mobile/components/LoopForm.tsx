import { useState, useRef, type ReactNode } from "react";
import { router } from "expo-router";
import { Keyboard } from "react-native";
import { type FieldSpec, validateFields } from "../lib/forms";
import { FormScreen } from "./FormScreen";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopInput } from "./LoopInput";
import { LoopButton } from "./LoopButton";
import { FeedbackBanner } from "./AsyncState";
export function dismissTo(path: string) {
  if (router.canGoBack()) router.back();
  else router.replace(path);
}
export function LoopForm({
  title,
  description,
  fields,
  initialValues = {},
  submitLabel,
  variant = "primary",
  onSubmit,
  fallback,
  children,
}: {
  title: string;
  description: string;
  fields: readonly FieldSpec[];
  initialValues?: Record<string, string>;
  submitLabel: string;
  variant?: "primary" | "marketplace" | "rides" | "study";
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  fallback: string;
  children?: ReactNode;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  async function submit() {
    if (lock.current) return;
    const error = validateFields(fields, values);
    setError(error ?? "");
    if (error) return;
    Keyboard.dismiss();
    lock.current = true; setSubmitting(true);
    try { await onSubmit(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])),
    ); } catch (e) { setError((e as Error).message); } finally { lock.current = false; setSubmitting(false); }
  }
  return (
    <FormScreen>
      <LoopCard panel>
        <LoopText variant="sectionHeading">{title}</LoopText>
        <LoopText variant="smallBody">{description}</LoopText>
        {children}
        {fields.map((f) => (
          <LoopInput
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            value={values[f.key] ?? ""}
            onChangeText={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
            multiline={f.multiline}
            maxLength={f.numeric ? undefined : f.max}
            keyboardType={f.numeric ? "number-pad" : "default"}
            autoCapitalize={f.key === "course" ? "characters" : "sentences"}
          />
        ))}
        {error ? <FeedbackBanner tone="error" message={error} /> : null}
        <LoopButton variant={variant} disabled={submitting} onPress={submit}>
          {submitting ? "Saving…" : submitLabel}
        </LoopButton>
        <LoopButton variant="secondary" onPress={() => dismissTo(fallback)}>
          Cancel
        </LoopButton>
        <LoopText variant="chip">
          Changes are saved to your Loop account.
        </LoopText>
      </LoopCard>
    </FormScreen>
  );
}
