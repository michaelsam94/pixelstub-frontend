import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Download, ExternalLink, ImageIcon, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { buildPlaceholder } from "../../../shared/api/client";
import { defaultSpec, placeholderSchema, PlaceholderSpec } from "../model/schema";
import { useBuilderStore } from "../model/store";

const presets = [
  { label: "OG", width: 1200, height: 630 },
  { label: "Square", width: 1080, height: 1080 },
  { label: "Wide", width: 1920, height: 1080 },
  { label: "Avatar", width: 512, height: 512 }
];

export function PlaceholderBuilder() {
  const { lastSpec, setLastSpec } = useBuilderStore();
  const form = useForm<PlaceholderSpec>({
    resolver: zodResolver(placeholderSchema),
    defaultValues: lastSpec
  });

  const mutation = useMutation({
    mutationFn: buildPlaceholder,
    onSuccess: (data) => setLastSpec(data.spec)
  });

  const watched = form.watch();
  const previewStyle = useMemo(
    () => ({
      backgroundColor: `#${watched.bgHex || defaultSpec.bgHex}`,
      color: `#${watched.fgHex || defaultSpec.fgHex}`,
      aspectRatio: `${watched.width || 1200} / ${watched.height || 630}`
    }),
    [watched.bgHex, watched.fgHex, watched.height, watched.width]
  );

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));
  const url = mutation.data?.url;

  return (
    <main className="builder">
      <section className="workspace" aria-label="Placeholder builder">
        <div className="preview-panel">
          <div className="preview-meta">
            <span>{watched.width || 0} x {watched.height || 0}</span>
            <span>{watched.format?.toUpperCase()}</span>
          </div>
          <div className="preview" style={previewStyle}>
            <span>{watched.text || " "}</span>
          </div>
        </div>

        <form className="controls" onSubmit={onSubmit} autoComplete="off">
          <div className="brand-row">
            <ImageIcon aria-hidden="true" size={24} />
            <h1>PixelStub</h1>
          </div>

          <div className="preset-row" aria-label="Size presets">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  form.setValue("width", preset.width, { shouldValidate: true });
                  form.setValue("height", preset.height, { shouldValidate: true });
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="field-grid">
            <Field label="Width" error={form.formState.errors.width?.message}>
              <input type="number" min={1} max={5000} {...form.register("width")} />
            </Field>
            <Field label="Height" error={form.formState.errors.height?.message}>
              <input type="number" min={1} max={5000} {...form.register("height")} />
            </Field>
          </div>

          <div className="field-grid">
            <Field label="Background" error={form.formState.errors.bgHex?.message}>
              <input {...form.register("bgHex")} />
            </Field>
            <Field label="Text color" error={form.formState.errors.fgHex?.message}>
              <input {...form.register("fgHex")} />
            </Field>
          </div>

          <Field label="Format" error={form.formState.errors.format?.message}>
            <select {...form.register("format")}>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="gif">GIF</option>
              <option value="webp">WEBP</option>
            </select>
          </Field>

          <Field label="Text" error={form.formState.errors.text?.message}>
            <input maxLength={200} {...form.register("text")} />
          </Field>

          <button className="primary" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="spin" size={18} /> : <ExternalLink size={18} />}
            Build URL
          </button>

          {mutation.error ? (
            <p className="error" role="alert">{mutation.error.message}</p>
          ) : null}

          {url ? (
            <div className="result">
              <input readOnly value={url} aria-label="Generated image URL" />
              <a className="icon-button" href={url} download title="Download">
                <Download size={18} />
              </a>
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
