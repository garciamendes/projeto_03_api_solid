import { CheckIn } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/lateCheckInValidation-error'

interface IValidateCheckInRequest {
  checkinId: string
}

interface IValidateCheckInResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkinId,
  }: IValidateCheckInRequest): Promise<IValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkinId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinuteFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created,
      'minutes',
    )

    if (distanceInMinuteFromCheckInCreation > 20)
      throw new LateCheckInValidationError()

    checkIn.validated = new Date()
    await this.checkInsRepository.save(checkIn)
    return { checkIn }
  }
}
