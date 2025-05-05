import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private CheckIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };
    this.CheckIns.push(checkIn);
    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate =
      this.CheckIns.find((checkIn) => {
        const checkInDate = dayjs(checkIn.created_at);
        const isOnSameDate =
          checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay);
        return checkIn.user_id === userId && isOnSameDate;
      }) || null;

    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return Promise.resolve(
      this.CheckIns.filter((checkIn) => checkIn.user_id === userId).slice(
        (page - 1) * 20,
        page * 20
      )
    );
  }

  countByUserId(userId: string): Promise<number> {
    return Promise.resolve(
      this.CheckIns.filter((checkIn) => checkIn.user_id === userId).length
    );
  }

  findById(checkInId: string): Promise<CheckIn | null> {
    return Promise.resolve(
      this.CheckIns.find((checkIn) => checkIn.id === checkInId) || null
    );
  }

  save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.CheckIns.findIndex(
      (checkIn) => checkIn.id === checkIn.id
    );

    if (checkInIndex >= 0) {
      this.CheckIns[checkInIndex] = checkIn;
    }

    return Promise.resolve(checkIn);
  }
}
