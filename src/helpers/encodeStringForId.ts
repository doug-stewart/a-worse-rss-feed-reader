/*
  Creates a more clean, consistent URI by:
   - replacing spaces with hyphens so they don't get encoded
   - encoding the string to make URL-safe
   - removing encoded characters (they don't add meaning)
   - removing additional hyphens (they are noise)
  */

export const encodeStringForId = (string: string) =>
  encodeURIComponent(string.toLocaleLowerCase().replace(/ /g, "-"))
    .replace(/%\w+/g, "")
    .replace(/--/g, "-");
