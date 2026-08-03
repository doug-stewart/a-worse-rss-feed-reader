import { useState } from "react";
import { useOPMLImport } from "../../hooks/useOPMLImport";

export const FeedImporter = () => {
  const [uploading, setUploading] = useState(false);
  const importOPML = useOPMLImport();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = event.target.files?.[0];
    await importOPML.mutateAsync(file);
    setUploading(false);
  };

  return (
    <label>
      Upload an OPML file to import your feeds:
      <br />
      <input accept=".opml" disabled={uploading} onChange={handleUpload} type="file" />
    </label>
  );
};
