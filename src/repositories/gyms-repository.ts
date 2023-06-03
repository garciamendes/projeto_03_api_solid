// Third party
import { Gym, Prisma } from '@prisma/client'

export interface IFindManyNearbyProps {
  latitude: number
  longitude: number
}

export interface IGymsRepository {
  findById: (id: string) => Promise<Gym | null>
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
  findManyNearby: ({
    latitude,
    longitude,
  }: IFindManyNearbyProps) => Promise<Gym[]>
  findManyBySearch: (search: string, page: number) => Promise<Gym[]>
}
