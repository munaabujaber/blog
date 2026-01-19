/** @format */

import { getCategories } from "@/actions/category";
import CategoriesClien from "./client/categories-client";

export default async function CategoriesPage() {
  const data = await getCategories();

  return (
    <div>
      <CategoriesClien categories={data!} />
    </div>
  );
}
