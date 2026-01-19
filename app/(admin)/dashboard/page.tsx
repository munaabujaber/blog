/** @format */

// /** @format */

// import "@/app/globals.css";
// import {
//   DeleteUserButton,
//   PlaceHolderDeleteUserButton,
// } from "@/components/buttons/delete-user";
// import { ReturnButton } from "@/components/buttons/return";
// import { UserRoleSelect } from "@/components/user-role-select";
// import { auth } from "@/lib/auth";
// import { User } from "@/prisma/generated/client";
// import { UserRole } from "@/prisma/generated/enums";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function Page() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({
//     headers: headersList,
//   });

//   if (!session) redirect("/auth/login");

//   if (session.user.role !== "ADMIN") {
//     return (
//       <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
//         <div className="space-y-8">
//           <ReturnButton href="/profile" label="Profile" />
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <p className="p-2 rounded-md text-lg bg-(--error-bg) text-(--color-primary-foreground) font-bold">
//             FORBIDDEN
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const { users } = await auth.api.listUsers({
//     headers: headersList,
//     query: {
//       sortBy: "name",
//     },
//   });

//   const sortedUsers = users.sort((a: User, b: User) => {
//     if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
//     if (a.role !== UserRole.ADMIN && b.role === UserRole.ADMIN) return 1;
//     return 0;
//   });

//   return (
//     <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
//       <div className="space-y-8">
//         <ReturnButton href="/profile" label="Profile" />
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="p-2 rounded-md text-lg bg-(--success-bg) text-(--color-primary-foreground) font-bold">
//           ACCESS GRANTED
//         </p>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <table className="table-auto min-w-full whitespace-nowrap">
//           <thead>
//             <tr className="border-b text-sm text-left">
//               <th className="px-2 py-2">ID</th>
//               <th className="px-2 py-2">Name</th>
//               <th className="px-2 py-2">Email</th>
//               <th className="px-2 py-2 text-center">Role</th>
//               <th className="px-2 py-2 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {sortedUsers.map((user) => (
//               <tr key={user.id} className="border-b text-sm text-left">
//                 <td className="px-4 py-2"> {user.id.slice(0, 8)}</td>
//                 <td className="px-4 py-2"> {user.name}</td>
//                 <td className="px-4 py-2"> {user.email}</td>
//                 <td className="px-4 py-2 text-center">
//                   <UserRoleSelect
//                     userId={user.id}
//                     role={user.role as UserRole}
//                   ></UserRoleSelect>
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   {" "}
//                   {user.role === "USER" ? (
//                     <DeleteUserButton userId={user.id} />
//                   ) : (
//                     <PlaceHolderDeleteUserButton />
//                   )}{" "}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

/** @format */

import { getCategoriesWithUser } from "@/actions/category";
import { getPostsByUser } from "@/actions/post";
import DashboardCard from "@/components/dashboard-card";
import DashboardCategories from "@/components/dashboard-categories";
import DashboardChart from "@/components/dashboard-chart";
import { authSession, requireAuth } from "@/lib/auth-utils";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  await requireAuth();
  const session = await authSession();
  const posts = await getPostsByUser();
  const categories = await getCategoriesWithUser();

  const totalViews = posts.reduce((acc, item) => acc + item.views!, 0);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap w-full flex-col gap-6 p-14 px-6">
        <Link
          href="/"
          target="_blank"
          className="text-blue-600 font-medium gap-2 items-center flex"
        >
          <span>Visit public site</span>
          <Rocket />
        </Link>
        <h1 className="font-semibold text-2xl">Hi, {session?.user.name}</h1>
      </div>
      <div className="container flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardCard
            totalPosts={posts.length}
            totalCategories={categories.length}
            totalViews={totalViews}
          />
        </div>

        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <DashboardChart data={posts} />
            <DashboardCategories categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
