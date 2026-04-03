import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";
import { pool } from "../lib/db.js";
import type { JwtPayload } from "../middleware/auth.js";

function signAccessToken(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  const opts: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: payload.sub, email: payload.email }, secret, opts);
}

function signRefreshToken(payload: JwtPayload) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET manquant");
  const opts: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: payload.sub, email: payload.email }, secret, opts);
}

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password: string;
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.execute(
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
      [id, email.toLowerCase().trim(), hash]
    );
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }
    throw e;
  }
  const payload: JwtPayload = { sub: id, email: email.toLowerCase().trim() };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.status(201).json({
    user: { id, email: payload.email },
    accessToken,
    refreshToken,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const [rows] = await pool.execute<UserRow[]>(
    "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()]
  );
  const user = rows[0] as UserRow | undefined;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const payload: JwtPayload = { sub: user.id, email: user.email };
  res.json({
    user: { id: user.id, email: user.email },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token requis" });
  }
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET manquant");
    const decoded = jwt.verify(refreshToken, secret) as JwtPayload;
    const payload: JwtPayload = { sub: decoded.sub, email: decoded.email };
    res.json({ accessToken: signAccessToken(payload) });
  } catch {
    res.status(401).json({ message: "Refresh token invalide" });
  }
}

export function logout(_req: Request, res: Response) {
  res.status(204).send();
}
