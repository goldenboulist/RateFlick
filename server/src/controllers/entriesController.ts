import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../lib/db.js";

export interface EntryRow extends RowDataPacket {
  id: string;
  user_id: string;
  title: string;
  rating: string;
  genre: string;
  description: string | null;
  poster_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function listEntries(req: Request, res: Response) {
  const userId = req.user!.sub;
  const [rows] = await pool.execute<EntryRow[]>(
    "SELECT id, user_id, title, rating, genre, description, poster_url, created_at, updated_at FROM entries WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  res.json(rows.map(serializeEntry));
}

export async function createEntry(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { title, rating, genre, description, poster_url } = req.body as {
    title?: string;
    rating?: number;
    genre?: string;
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
  await pool.execute(
    "INSERT INTO entries (id, user_id, title, rating, genre, description, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, userId, title.trim(), r, genre || "Autre", description ?? null, poster_url ?? null]
  );
  const [rows] = await pool.execute<EntryRow[]>(
    "SELECT id, user_id, title, rating, genre, description, poster_url, created_at, updated_at FROM entries WHERE id = ?",
    [id]
  );
  res.status(201).json(serializeEntry(rows[0]));
}

export async function updateEntry(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.params;
  const { title, rating, genre, description, poster_url } = req.body as {
    title?: string;
    rating?: number;
    genre?: string;
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
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE entries SET title = ?, rating = ?, genre = ?, description = ?, poster_url = ? WHERE id = ? AND user_id = ?",
    [title.trim(), r, genre || "Autre", description ?? null, poster_url ?? null, id, userId]
  );
  if (!result.affectedRows) {
    return res.status(404).json({ message: "Entrée introuvable" });
  }
  const [rows] = await pool.execute<EntryRow[]>(
    "SELECT id, user_id, title, rating, genre, description, poster_url, created_at, updated_at FROM entries WHERE id = ?",
    [id]
  );
  res.json(serializeEntry(rows[0]));
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

function serializeEntry(row: EntryRow) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    rating: parseFloat(row.rating),
    genre: row.genre,
    description: row.description,
    posterUrl: row.poster_url,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}
