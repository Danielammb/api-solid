import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

const MAX_DISTANCE_IN_KILOMETERS = 10;

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((_gym) => _gym.id === id) || null;
    return gym;
  }

  async searchByQuery(query: string, page: number): Promise<Gym[]> {
    let gyms: Gym[] | [] = [];
    gyms = this.gyms.filter((_gym) => _gym.title.includes(query));
    return gyms.slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      ...data,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    } as Gym;
    this.gyms.push(gym);
    return gym;
  }

  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return Promise.resolve(
      this.gyms
        .filter((gym) => {
          const distance = getDistanceBetweenCoordinates(
            { latitude: params.latitude, longitude: params.longitude },
            { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
          );

          return distance < MAX_DISTANCE_IN_KILOMETERS;
        })
        .slice((params.page - 1) * 20, params.page * 20)
    );
  }
}
