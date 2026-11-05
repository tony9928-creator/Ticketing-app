import { AppError } from "../../errors/AppError";
import { UserRepository } from "./user.repository";
import { PublicUser, Rol, toPublicUser } from "./user.types";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async getById(id: string): Promise<PublicUser> {
    const user = await this.users.findById(id);
    if (!user) throw AppError.notFound("Usuario no encontrado");
    return toPublicUser(user);
  }

  async list(): Promise<PublicUser[]> {
    return (await this.users.findAll()).map(toPublicUser);
  }

  async updateRol(id: string, rol: Rol): Promise<PublicUser> {
    const user = await this.users.updateRol(id, rol);
    if (!user) throw AppError.notFound("Usuario no encontrado");
    return toPublicUser(user);
  }
}
