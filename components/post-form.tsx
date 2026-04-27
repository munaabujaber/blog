/** @format */

"use client";

import { updatePost, createPost } from "@/actions/post";
import { generateSlug } from "@/lib/utils";
import { z, object } from "zod";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import FileUploader from "./file-uploader";
import type { Category, Type } from "@/prisma/generated/client";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});
const SelectInput = dynamic(() => import("react-select"), {
  ssr: false,
});

const POST_STATUS_VALUES = ["published", "draft"] as const;
const PostStatusZ = z.enum(
  (POST_STATUS_VALUES as unknown) as [string, ...string[]],
);

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, { message: "Title is required." }),
  slug: z.string().trim().min(3, { message: "Slug is required." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." }),
  content: z.string().trim().min(3, { message: "Content is required." }),
  imageUrl: z
    .string()
    .trim()
    .min(1, { message: "Image URL is required." })
    .url({ message: "Image URL must be valid." }),
  tags: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  status: PostStatusZ,
  readingTimeMins: z
    .number()
    .int()
    .min(1, { message: "Reading time must be at least 1." }),
  featured: z.boolean().default(false),
  repoUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^https?:\/\//i.test(value), {
      message: "Repository URL must start with http:// or https://",
    })
    .default(""),
  relatedPosts: z
    .array(object({ id: z.string(), title: z.string() }))
    .default([]),
  categoryId: z.string().default(""),
  typeId: z.string().default(""),
  seriesId: z.string().default(""),
});

export type PostFormValues = z.infer<typeof formSchema>;

type RelatedPostOption = {
  id: string;
  title: string;
};
type SelectOption = {
  value: string;
  label: string;
};

type PostFormProps = Partial<PostFormValues> & {
  categories?: Pick<Category, "id" | "name">[];
  types?: Pick<Type, "id" | "name">[];
  seriesOptions?: { id: string; name: string }[];
  availableRelatedPosts?: RelatedPostOption[];
};

const HEAVY_FIELD_ITEM_CLASS = "relative isolate z-0";

export default function PostForm({
  id,
  title,
  slug,
  description,
  content,
  imageUrl,
  tags,
  status,
  readingTimeMins,
  featured,
  repoUrl,
  relatedPosts,
  categories,
  categoryId,
  types,
  typeId,
  seriesId,
  seriesOptions,
  availableRelatedPosts,
}: PostFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const defaultValues = useMemo(
    () => ({
      id,
      title: title ?? "",
      slug: slug ?? "",
      description: description ?? "",
      content: content ?? "",
      imageUrl: imageUrl ?? "",
      tags: tags ?? [],
      status: status ?? "draft",
      readingTimeMins: readingTimeMins ?? 1,
      featured: featured ?? false,
      repoUrl: repoUrl ?? "",
      relatedPosts: relatedPosts ?? [],
      categoryId: categoryId ?? "",
      typeId: typeId ?? "",
      seriesId: seriesId ?? "",
    }),
    [
      id,
      title,
      slug,
      description,
      content,
      imageUrl,
      tags,
      status,
      readingTimeMins,
      featured,
      repoUrl,
      relatedPosts,
      categoryId,
      typeId,
      seriesId,
    ],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const formElement = formRef.current;
      if (!formElement) return;

      const textInputs = Array.from(
        formElement.querySelectorAll<HTMLInputElement>(
          'input[data-post-text-input="true"]',
        ),
      );

      const clickedInput = textInputs.find((input) => {
        const rect = input.getBoundingClientRect();
        return (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        );
      });

      if (!clickedInput) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      clickedInput.focus({ preventScroll: true });
      if (clickedInput.type !== "number") {
        const textLength = clickedInput.value.length;
        clickedInput.setSelectionRange(textLength, textLength);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (id) {
        await updatePost(data);
        toast.success("Post updated successfully!");
      } else {
        await createPost(data);
        toast.success("Post created successfully!");
      }

      router.refresh();
      router.push("posts");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save post changes.",
      );
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(48rem,1fr)_22rem]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex min-w-0 flex-col gap-6 py-6">
          <div className="relative isolate z-30 flex min-w-0 flex-col gap-6">
            <FormField
              control={form.control}
              name="readingTimeMins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Time (mins)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      data-post-text-input="true"
                      min={1}
                      step={1}
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(isNaN(value) ? 1 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      data-post-text-input="true"
                      placeholder="https://github.com/owner/repo"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input data-post-text-input="true" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      data-post-text-input="true"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();

                        if (!form.getValues("slug")) {
                          form.setValue("slug", generateSlug(e.target.value), {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input data-post-text-input="true" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className={HEAVY_FIELD_ITEM_CLASS}>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader
                    endpoint="imageUploader"
                    size={{ width: "w-full", height: "h-60" }}
                    defaultUrl={field.value}
                    onChangeAction={(url) => {
                      field.onChange(url ?? "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className={HEAVY_FIELD_ITEM_CLASS}>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <SimpleEditor
                    content={typeof field.value === "string" ? field.value : ""}
                    action={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <CreatableSelect
                    isMulti
                    isClearable
                    {...field}
                    onCreateOption={(value) => {
                      const newOption = {
                        label: value,
                        value: value.toLocaleLowerCase(),
                      };
                      field.onChange([...(field.value ?? []), newOption]);
                    }}
                    components={{ IndicatorsContainer: () => null }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relatedPosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Posts</FormLabel>
                <FormControl>
                  <SelectInput
                    isMulti
                    options={(availableRelatedPosts ?? []).map((post) => ({
                      value: post.id,
                      label: post.title,
                    }))}
                    value={(field.value ?? []).map((post) => ({
                      value: post.id,
                      label: post.title,
                    }))}
                    onChange={(selected: readonly SelectOption[] | null) => {
                      const nextValue = (selected ?? []).map((item) => ({
                        id: item.value,
                        title: item.label,
                      }));
                      field.onChange(nextValue);
                    }}
                    placeholder="Select related posts..."
                    isClearable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="relative z-10 flex min-w-0 flex-col gap-6">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Extra Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Post</FormLabel>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || "__none"}
                        onValueChange={(value) =>
                          field.onChange(value === "__none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">No category</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {POST_STATUS_VALUES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || "__none"}
                        onValueChange={(value) =>
                          field.onChange(value === "__none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">No type</SelectItem>
                          {types?.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seriesId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || "__none"}
                        onValueChange={(value) =>
                          field.onChange(value === "__none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Series" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">No series</SelectItem>
                          {seriesOptions?.map((seriesItem) => (
                            <SelectItem
                              key={seriesItem.id}
                              value={seriesItem.id}
                            >
                              {seriesItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          className="max-w-40 cursor-pointer"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spinner className="size-6" />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
