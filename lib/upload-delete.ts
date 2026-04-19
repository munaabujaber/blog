/** @format */

export async function deleteUploadByUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch("/api/uploads", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      console.error("Failed to delete upload by URL:", payload);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete upload request failed:", error);
    return false;
  }
}
