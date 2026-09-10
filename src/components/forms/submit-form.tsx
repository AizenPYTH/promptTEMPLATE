"use client";

import { useState } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { categories, technologies } from "@/data/taxonomy";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";

interface FormState {
  name: string;
  description: string;
  category: string;
  website: string;
  author: string;
  email: string;
  technology: string;
  tags: string;
}

const empty: FormState = {
  name: "",
  description: "",
  category: "saas",
  website: "",
  author: "",
  email: "",
  technology: "nextjs",
  tags: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Give the template a name of at least two characters.";
  if (values.description.trim().length < 30)
    errors.description = "Write at least 30 characters — enough to say what makes it different.";
  if (values.description.trim().length > 400) errors.description = "Keep it under 400 characters.";
  if (!/^https?:\/\/[^\s.]+\.\S{2,}$/.test(values.website.trim()))
    errors.website = "Enter a full URL, including https://";
  if (values.author.trim().length < 2) errors.author = "Tell us who made it.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(values.email.trim()))
    errors.email = "Enter an email address we could reply to.";
  return errors;
}

export function SubmitForm() {
  const [values, setValues] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const set = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [key]: event.target.value };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  };

  const blur = (key: keyof FormState) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({
      name: true,
      description: true,
      website: true,
      author: true,
      email: true,
      category: true,
      technology: true,
      tags: true,
    });
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("submitting");
    // Nothing is sent anywhere. The delay exists so the interface behaves the
    // way it would against a real endpoint.
    window.setTimeout(() => {
      setStatus("done");
      setModalOpen(true);
      toast({ title: "Template submitted", description: `${values.name} is in the review queue.`, tone: "success" });
    }, 900);
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setModalOpen(false);
  };

  const invalid = (key: keyof FormState) => Boolean(touched[key] && errors[key]);

  return (
    <>
      <div className="mb-6 flex gap-3 rounded-card border border-line bg-surface-3 p-4 text-[13px] leading-6 text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <p>
          <span className="font-medium text-ink">This form is a front-end demonstration.</span> Nothing
          is transmitted, stored or emailed — submitting validates the fields and shows the success
          state so you can see how the flow behaves.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="name">Template name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            placeholder="Aurora"
            aria-invalid={invalid("name")}
            aria-describedby={invalid("name") ? "name-error" : undefined}
            autoComplete="off"
          />
          {invalid("name") ? <FieldError id="name-error">{errors.name}</FieldError> : null}
        </div>

        <div>
          <Label htmlFor="description" hint={`${values.description.trim().length}/400`}>
            Description
          </Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={set("description")}
            onBlur={blur("description")}
            placeholder="What is it for, and what makes it different from the other twelve templates that look like it?"
            aria-invalid={invalid("description")}
            aria-describedby={invalid("description") ? "description-error" : undefined}
          />
          {invalid("description") ? <FieldError id="description-error">{errors.description}</FieldError> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={values.category} onChange={set("category")}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="technology">Primary technology</Label>
            <Select id="technology" value={values.technology} onChange={set("technology")}>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="website" hint="Live site or demo">
            Website URL
          </Label>
          <Input
            id="website"
            type="url"
            inputMode="url"
            value={values.website}
            onChange={set("website")}
            onBlur={blur("website")}
            placeholder="https://aurora.example.com"
            aria-invalid={invalid("website")}
            aria-describedby={invalid("website") ? "website-error" : undefined}
          />
          {invalid("website") ? <FieldError id="website-error">{errors.website}</FieldError> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={values.author}
              onChange={set("author")}
              onBlur={blur("author")}
              placeholder="Your name or studio"
              aria-invalid={invalid("author")}
              aria-describedby={invalid("author") ? "author-error" : undefined}
              autoComplete="name"
            />
            {invalid("author") ? <FieldError id="author-error">{errors.author}</FieldError> : null}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={set("email")}
              onBlur={blur("email")}
              placeholder="you@studio.com"
              aria-invalid={invalid("email")}
              aria-describedby={invalid("email") ? "email-error" : undefined}
              autoComplete="email"
            />
            {invalid("email") ? <FieldError id="email-error">{errors.email}</FieldError> : null}
          </div>
        </div>

        <div>
          <Label htmlFor="tags" hint="Comma separated">
            Tags
          </Label>
          <Input
            id="tags"
            value={values.tags}
            onChange={set("tags")}
            placeholder="dashboard, dark, keyboard"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button type="submit" size="lg" disabled={status === "submitting"}>
            {status === "submitting" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {status === "submitting" ? "Submitting…" : "Submit template"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={reset}>
            Reset form
          </Button>
          <p className="text-xs text-soft">Review usually takes a week in a real submission queue.</p>
        </div>
      </form>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submission received"
        description="In this demo, nothing was sent."
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              Submit another
            </Button>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        }
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckCircle2 className="size-4.5" aria-hidden />
            </span>
            <div className="text-[13.5px] leading-6 text-muted">
              <p>
                <span className="font-medium text-ink">{values.name || "Your template"}</span> would now
                be in the review queue. A real submission would be checked for originality, accessibility
                and whether the prompt actually reproduces the design.
              </p>
              <p className="mt-3">
                Because Promptly has no backend, the details you entered stayed in this browser tab and
                have not been stored.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
