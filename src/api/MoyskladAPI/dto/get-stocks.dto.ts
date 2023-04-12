export class GetStocksDto {
  readonly limit?: number;
  readonly offset?: number;
  readonly search?: string;
  readonly type?: string;
  readonly productHref?: string;
}
