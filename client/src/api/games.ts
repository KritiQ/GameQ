export async function getDefaultGames(page = 1, search = "") {
  try {
    const res = await fetch(
      `http://localhost:3001/games?page=${page}&page_size=24&search=${search}`,
    );

    if (!res.ok) throw new Error("Failed to fetch games");

    return res.json();
  } catch (err) {
    console.error(err);
    return { results: [], total: 0 };
  }
}
