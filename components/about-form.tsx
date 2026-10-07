/** @format */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateAboutPageContent } from "@/actions/about";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { AboutPageContentValues } from "@/lib/about-content";

const aboutFormSchema = z.object({
  generalText: z
    .string()
    .trim()
    .min(20, { message: "About text should be at least 20 characters." }),
  mainPhotoUrl: z.string().url().nullable(),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

export default function AboutForm({
  content,
}: {
  content: AboutPageContentValues;
}) {
  const router = useRouter();
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      generalText: content.generalText,
      mainPhotoUrl: content.mainPhotoUrl,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: AboutFormValues) => {
    try {
      await updateAboutPageContent({
        generalText: values.generalText,
        mainPhotoUrl: values.mainPhotoUrl,
      });
      toast.success("About page updated.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update About page.",
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>
              Edit the main text shown on the public About page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="generalText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General text</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-80 resize-y leading-7"
                      placeholder="Write your About page text..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use blank lines to create separate paragraphs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Main Photo</CardTitle>
              <CardDescription>
                Upload or replace the primary image for the About page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="mainPhotoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="imageUploader"
                        size={{ width: "w-full", height: "h-72" }}
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
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-5" />
            ) : (
              "Save About page"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
