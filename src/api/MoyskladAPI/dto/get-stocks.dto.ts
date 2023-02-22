export class GetStocksDto {
  readonly limit?: number;
  readonly offset?: number;
  readonly type?: string;
  readonly productHref?: string;
}
