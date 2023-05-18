import { getGeospatialAxiosInstance } from "@/libs/api";
import { getCurrentUser } from "@/libs/session";

export async function POST(req: Request) {
  const session = await getCurrentUser();

  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }

  const formData = await req.formData();

  const axios = getGeospatialAxiosInstance();
  const { data } = await axios.post<{ count: number }>(`/activities/manual/${session.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return new Response(JSON.stringify(data), { status: 201 });
}
