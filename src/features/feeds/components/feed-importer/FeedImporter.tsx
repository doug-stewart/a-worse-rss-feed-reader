import { API_URL } from "@/config";

export const FeedImporter = () => {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file); //
    const result = await fetch(`${API_URL}/api/opml/import`, {
      credentials: "include",
      method: "POST",
      body: formData,
    });
    const data = await result.json();
    console.log({ data });
  };
  return (
    <label>
      Upload an OPML file to import your feeds:
      <br />
      <input accept=".opml" onChange={handleUpload} type="file" />
    </label>
  );
};
