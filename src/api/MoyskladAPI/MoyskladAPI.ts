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
}
