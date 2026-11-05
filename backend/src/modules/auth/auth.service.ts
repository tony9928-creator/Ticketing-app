import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { UserRepository } from "../user/user.repository";
import { isRol, Rol, toPublicUser } from "../user/user.types";
import { AuthResult, TokenPayload } from "./auth.types";
import { LoginInput, RegisterInput } from "./auth.validation";

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    if (await this.users.findByEmail(input.email)) {
      throw AppError.conflict("El email ya está registrado");
    }
    const password = await bcrypt.hash(input.password, env.saltRounds);
    // El registro público siempre crea rol "user"; los roles elevados los asigna un admin.
    const user = await this.users.create({ nombre: input.nombre, email: input.email, password, rol: "user" });
    return { user: toPublicUser(user), token: this.sign(user.id, user.rol) };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    const valid = user && (await bcrypt.compare(input.password, user.password));
    if (!user || !valid) throw AppError.unauthorized("Credenciales inválidas");
    return { user: toPublicUser(user), token: this.sign(user.id, user.rol) };
  }

  verify(token: string): TokenPayload {
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch {
      throw AppError.unauthorized("Token inválido o expirado");
    }
    if (typeof payload === "string" || !payload.sub || !isRol(payload.rol)) {
      throw AppError.unauthorized("Token inválido o expirado");
    }
    return { sub: payload.sub, rol: payload.rol };
  }

  private sign(userId: string, rol: Rol) {
    return jwt.sign({ rol }, env.jwtSecret, {
      subject: userId,
      expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    });
  }
}
