import { UpdateVariantDto } from './dto/update-variant.dto';
import { $authHost } from 'api';
import { IMoyskladData } from 'models/api/moysklad/IMoyskladData';
import { ILoss } from 'models/api/moysklad/ILoss';
import { IPosition } from 'models/api/moysklad/IPosition';
import { CreateLossPositionsDto } from './dto/create-loss-positions.dto';
import { CreateLossDto } from './dto/create-loss.dto';
import { DeleteLossPositionDto } from './dto/delete-loss-position.dto';
import { EditLossPositionDto } from './dto/edit-loss-position.dto';
import { GetLossesDto } from './dto/get-losses.dto';
import { GetLossPositionsDto } from './dto/get-loss-positions.dto';
import { IStore } from 'models/api/moysklad/IStore';
import { CreateMoveDto } from './dto/create-move.dto';
import { IMove } from 'models/api/moysklad/IMove';
import { GetMovesDto } from './dto/get-moves.dto';
import { CreateMovePositionsDto } from './dto/create-move-positions.dto';
import { GetMovePositionsDto } from './dto/get-move-positions.dto';
import { EditMovePositionDto } from './dto/edit-move-position.dto';
import { DeleteMovePositionDto } from './dto/delete-move-position.dto';
import { GetAssortmentDto } from './dto/get-assortment.dto';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { INotification } from 'models/api/moysklad/INotification';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { IProduct } from 'models/api/moysklad/IProduct';
import { GetStocksDto } from './dto/get-stocks.dto';
import { IStock } from 'models/api/moysklad/IStock';
import { IVariant } from 'models/api/moysklad/IVariant';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetSuppliesDto } from './dto/get-supplies.dto';
import { ISupply } from 'models/api/moysklad/ISupply';
import { GetSupplyPositionsDto } from './dto/get-supply-positions.dto';
import { EditSupplyDto } from './dto/edit-supply.dto';

export default class MoyskladAPI {
  // Loss
  static async createLoss(createLossDto: CreateLossDto): Promise<ILoss> {
    const { data } = await $authHost.post('moysklad/loss', createLossDto);
    return data;
  }

  static async getLosses(
    getLossesDto: GetLossesDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<ILoss>> {
    const { data } = await $authHost.get('moysklad/loss', {
      params: getLossesDto,
      signal,
    });
    return data;
  }

  static async createLossPosition(
    createLossPositionsDto: CreateLossPositionsDto
  ): Promise<IPosition[]> {
    const { data } = await $authHost.post(
      'moysklad/loss/positions',
      createLossPositionsDto
    );
    return data;
  }

  static async getLossPositions(
    getLossPositionsDto: GetLossPositionsDto
  ): Promise<IMoyskladData<IPosition>> {
    const { data } = await $authHost.get('moysklad/loss/positions', {
      params: getLossPositionsDto,
    });
    return data;
  }

  static async editLossPosition(
    editLossPositionDto: EditLossPositionDto
  ): Promise<IPosition> {
    const { data } = await $authHost.put(
      'moysklad/loss/position',
      editLossPositionDto
    );
    return data;
  }

  static async deleteLossPosition(
    deleteLossPositionDto: DeleteLossPositionDto
  ): Promise<string> {
    const { data } = await $authHost.delete('moysklad/loss/position', {
      params: deleteLossPositionDto,
    });
    return data;
  }

  // Store
  static async getStores(signal?: AbortSignal): Promise<IMoyskladData<IStore>> {
    const { data } = await $authHost.get('moysklad/store', { signal });
    return data;
  }

  // Move
  static async createMove(createMoveDto: CreateMoveDto): Promise<IMove> {
    const { data } = await $authHost.post('moysklad/move', createMoveDto);
    return data;
  }

  static async getMoves(
    getMovesDto: GetMovesDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<IMove>> {
    const { data } = await $authHost.get('moysklad/move', {
      params: getMovesDto,
      signal,
    });
    return data;
  }

  static async createMovePosition(
    createMovePositionsDto: CreateMovePositionsDto
  ): Promise<IPosition[]> {
    const { data } = await $authHost.post(
      'moysklad/move/positions',
      createMovePositionsDto
    );
    return data;
  }

  static async getMovePositions(
    getMovePositionsDto: GetMovePositionsDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<IPosition>> {
    const { data } = await $authHost.get('moysklad/move/positions', {
      params: getMovePositionsDto,
      signal,
    });
    return data;
  }

  static async editMovePosition(
    editMovePositionDto: EditMovePositionDto
  ): Promise<IPosition> {
    const { data } = await $authHost.put(
      'moysklad/move/position',
      editMovePositionDto
    );
    return data;
  }

  static async deleteMovePosition(
    deleteMovePositionDto: DeleteMovePositionDto
  ): Promise<string> {
    const { data } = await $authHost.delete('moysklad/move/position', {
      params: deleteMovePositionDto,
    });
    return data;
  }

  // Assortment
  static async getAssortment(
    getAssortmentDto: GetAssortmentDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<IAssortment>> {
    const { data } = await $authHost.get('moysklad/assortment', {
      params: getAssortmentDto,
      signal,
    });
    return data;
  }

  // Notification
  static async getNotifications(
    getNotificationsDto: GetNotificationsDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<INotification>> {
    const { data } = await $authHost.get('moysklad/notification', {
      params: getNotificationsDto,
      signal,
    });
    return data;
  }

  // Product
  static async getProduct(id: string): Promise<IProduct> {
    const { data } = await $authHost.get(`moysklad/product/${id}`);
    return data;
  }

  static async updateProduct(
    updateProductDto: UpdateProductDto
  ): Promise<IProduct> {
    const { data } = await $authHost.put('moysklad/product', updateProductDto);
    return data;
  }

  static async updateProducts(
    products: UpdateProductDto[]
  ): Promise<IProduct[]> {
    const { data } = await $authHost.put('moysklad/product/multiple', products);
    return data;
  }

  // Variant
  static async getVariant(id: string): Promise<IVariant> {
    const { data } = await $authHost.get(`moysklad/variant/${id}`);
    return data;
  }

  static async updateVariant(
    updateVariantDto: UpdateVariantDto
  ): Promise<IVariant> {
    const { data } = await $authHost.put('moysklad/variant', updateVariantDto);
    return data;
  }

  // Stock
  static async getStocks(
    getStocksDto: GetStocksDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<IStock>> {
    const { data } = await $authHost.get('moysklad/stock', {
      params: getStocksDto,
      signal,
    });
    return data;
  }

  // Supply
  static async getSupplies(
    getSuppliesDto: GetSuppliesDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<ISupply>> {
    const { data } = await $authHost.get('moysklad/supply', {
      params: getSuppliesDto,
      signal,
    });
    return data;
  }

  static async getSupplyPositions(
    getSupplyPositionsDto: GetSupplyPositionsDto,
    signal?: AbortSignal
  ): Promise<IMoyskladData<IPosition>> {
    const { data } = await $authHost.get('moysklad/supply/positions', {
      params: getSupplyPositionsDto,
      signal,
    });
    return data;
  }

  static async updateSupply(editSupplyDto: EditSupplyDto): Promise<ISupply> {
    const { data } = await $authHost.put('moysklad/supply', editSupplyDto);
    return data;
  }
}
