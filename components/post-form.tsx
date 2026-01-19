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
import { useEffect } from "react";
// local implementations
import ImageUploader from "@/components/image-uploader";
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
import FileUploader from "./file-uploader";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const POST_STATUS_VALUES = ["published", "draft"] as const;
const PostStatusZ = z.enum(
  (POST_STATUS_VALUES as unknown) as [string, ...string[]],
);

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Title is required." }),
  slug: z.string().min(3, { message: "Slug is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  content: z.string().min(3, { message: "Content is required." }),
  imageUrl: z.string().min(1, { message: "Image Url is required" }),
  tags: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  status: PostStatusZ,
  readingTimeMins: z.number().min(1),
  featured: z.boolean().optional(),
  repoUrl: z.string().optional(),
  relatedPosts: z
    .array(object({ id: z.string(), title: z.string() }))
    .optional(),
  userId: z.string().optional(),
  categories: z.array(object({ id: z.string(), name: z.string() })).optional(),
  categoryId: z.string().optional(),
  types: z.array(object({ id: z.string(), name: z.string() })).optional(),
  typeId: z.string().optional(),
  series: z.string().optional(),
  seriesId: z.string().optional(),
});

export type PostFormValues = z.infer<typeof formSchema>;

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
  series,
  seriesId,
}: PostFormValues) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      categories: categories ?? [],
      categoryId: categoryId ?? "",
      types: types ?? [],
      typeId: typeId ?? "",
      series: series ?? "",
      seriesId: seriesId ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.trigger();
  }, [form]);

  console.log("FORM ERRORS:", form.formState.errors);
  console.log("IS VALID:", form.formState.isValid);
  const onSubmit = async (data: PostFormValues) => {
    if (id) {
      await updatePost(data);
      toast.success("Post updated successfully!");
    } else {
      await createPost(data);
      toast.success("Post created successfully!");
    }

    router.refresh();
    router.push("posts");
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-6 py-6">
          <FormField
            control={form.control}
            name="readingTimeMins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading Time (mins)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader
                    endpoint="imageUploader"
                    size={{ width: "w-full", height: "h-60" }}
                    defaultUrl={field.value}
                    onChangeAction={(url) => {
                      field.onChange(url);
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
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <SimpleEditor content={field.value} action={field.onChange} />
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
        </div>

        <div className="flex flex-col gap-6">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Extra Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={categoryId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
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
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={status}
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
