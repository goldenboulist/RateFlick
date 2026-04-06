import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../lib/db.js";

export interface EntryRow extends RowDataPacket {
  id: string;
  user_id: string;
  title: string;
  rating: string;
  rank_order: number;
  genres: string | null;
  description: string | null;
  poster_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function listEntries(req: Request, res: Response) {
  const userId = req.user!.sub;
  const [rows] = await pool.execute<EntryRow[]>(
    `SELECT e.id, e.user_id, e.title, e.rating, e.rank_order, e.description, e.poster_url, e.created_at, e.updated_at,
     GROUP_CONCAT(g.name) as genres
     FROM entries e
     LEFT JOIN entries_genres eg ON e.id = eg.entry_id
     LEFT JOIN genres g ON eg.genre_id = g.id
     WHERE e.user_id = ?
     GROUP BY e.id
     ORDER BY e.rating DESC, e.rank_order ASC, e.created_at DESC`,
    [userId]
  );
  res.json(rows.map(serializeEntry));
}

export async function createEntry(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { title, rating, genres, description, poster_url } = req.body as {
    title?: string;
    rating?: number;
    genres?: string[];
    description?: string | null;
    poster_url?: string | null;
  };
  if (!title || rating === undefined || rating === null) {
    return res.status(400).json({ message: "Titre et note requis" });
  }
  const r = Number(rating);
  if (Number.isNaN(r) || r < 0 || r > 5) {
    return res.status(400).json({ message: "Note entre 0 et 5" });
  }
  const id = crypto.randomUUID();
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      "INSERT INTO entries (id, user_id, title, rating, description, poster_url, rank_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, userId, title.trim(), r, description ?? null, poster_url ?? null, 0]
    );

    if (genres && genres.length > 0) {
      for (const genreName of genres) {
        await connection.execute(
          "INSERT INTO entries_genres (entry_id, genre_id) SELECT ?, id FROM genres WHERE name = ?",
          [id, genreName]
        );
      }
    } else {
      await connection.execute(
        "INSERT INTO entries_genres (entry_id, genre_id) SELECT ?, id FROM genres WHERE name = 'Autre'",
        [id]
      );
    }

    await connection.commit();

    const [rows] = await connection.execute<EntryRow[]>(
      `SELECT e.id, e.user_id, e.title, e.rating, e.rank_order, e.description, e.poster_url, e.created_at, e.updated_at,
       GROUP_CONCAT(g.name) as genres
       FROM entries e
       LEFT JOIN entries_genres eg ON e.id = eg.entry_id
       LEFT JOIN genres g ON eg.genre_id = g.id
       WHERE e.id = ?
       GROUP BY e.id`,
      [id]
    );
    res.status(201).json(serializeEntry(rows[0]));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateEntry(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.params;
  const { title, rating, genres, description, poster_url } = req.body as {
    title?: string;
    rating?: number;
    genres?: string[];
    description?: string | null;
    poster_url?: string | null;
  };
  if (!title || rating === undefined || rating === null) {
    return res.status(400).json({ message: "Titre et note requis" });
  }
  const r = Number(rating);
  if (Number.isNaN(r) || r < 0 || r > 5) {
    return res.status(400).json({ message: "Note entre 0 et 5" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute<ResultSetHeader>(
      "UPDATE entries SET title = ?, rating = ?, description = ?, poster_url = ?, rank_order = ? WHERE id = ? AND user_id = ?",
      [title.trim(), r, description ?? null, poster_url ?? null, (req.body as any).rank_order ?? 0, id, userId]
    );

    if (!result.affectedRows) {
      await connection.rollback();
      return res.status(404).json({ message: "Entrée introuvable" });
    }

    // Update genres: delete existing and insert new ones
    await connection.execute("DELETE FROM entries_genres WHERE entry_id = ?", [id]);
    if (genres && genres.length > 0) {
      for (const genreName of genres) {
        await connection.execute(
          "INSERT INTO entries_genres (entry_id, genre_id) SELECT ?, id FROM genres WHERE name = ?",
          [id, genreName]
        );
      }
    } else {
      await connection.execute(
        "INSERT INTO entries_genres (entry_id, genre_id) SELECT ?, id FROM genres WHERE name = 'Autre'",
        [id]
      );
    }

    await connection.commit();

    const [rows] = await connection.execute<EntryRow[]>(
      `SELECT e.id, e.user_id, e.title, e.rating, e.rank_order, e.description, e.poster_url, e.created_at, e.updated_at,
       GROUP_CONCAT(g.name) as genres
       FROM entries e
       LEFT JOIN entries_genres eg ON e.id = eg.entry_id
       LEFT JOIN genres g ON eg.genre_id = g.id
       WHERE e.id = ?
       GROUP BY e.id`,
      [id]
    );
    res.json(serializeEntry(rows[0]));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteEntry(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.params;
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM entries WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  if (!result.affectedRows) {
    return res.status(404).json({ message: "Entrée introuvable" });
  }
  res.status(204).send();
}

export async function updateRanks(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { ranks } = req.body as { ranks: { id: string; rank_order: number }[] };

  if (!Array.isArray(ranks)) {
    return res.status(400).json({ message: "Tableau de rangs requis" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const item of ranks) {
      await connection.execute(
        "UPDATE entries SET rank_order = ? WHERE id = ? AND user_id = ?",
        [item.rank_order, item.id, userId]
      );
    }

    await connection.commit();
    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function serializeEntry(row: EntryRow) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    rating: parseFloat(row.rating),
    rankOrder: row.rank_order,
    genres: row.genres ? row.genres.split(",") : [],
    description: row.description,
    posterUrl: row.poster_url,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}
