import sql from "./db.js";

export const check_token: (string) => Promise<boolean> = async(tkn: string) => {
  const key = await sql`
    SELECT * FROM apikeys WHERE key = ${tkn}
  `;

  if(key.length < 1) {
    return false;
  }

  return true;
}