
export async function getDefaultGames() {
  try{
    const res = await fetch("http://localhost:3001/games");
    if (!res.ok) throw new Error("Failed to fetch games");
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
