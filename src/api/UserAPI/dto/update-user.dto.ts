export class UpdateUserDto {
  readonly id?: number;
  readonly name?: string;
  readonly surname?: string;
  readonly patronymic?: string;
  readonly phone?: string;
  readonly password?: undefined;
  readonly discount?: number;
  readonly email?: string;
  readonly vk?: string;
  readonly telegram?: string;
  readonly avatar?: string | null;
  readonly moyskladId?: string | null;
  readonly moyskladSynchronizedAt?: string | null;
  readonly archive?: boolean;
}
