export class CreateUserDto {
  readonly name?: string;
  readonly surname?: string;
  readonly patronymic?: string;
  readonly phone?: string;
  readonly password?: string;
  readonly discount?: number;
  readonly avatar?: string | null;
  readonly email?: string;
  readonly vk?: string;
  readonly telegram?: string;
  readonly moyskladId?: string | null;
  readonly moyskladSynchronizedAt?: string | null;
}
