import { $authHost } from 'api';
import { IFinishedProduct } from 'models/api/IFinishedProduct';
import { IOrder, IOrderData } from 'models/api/IOrder';
import { CreateOrderDto } from './dto/create-order.dto';
import { EditOrderShopDto } from './dto/edit-order-shop.dto';
import { EditOrderStatusDto } from './dto/edit-order-status.dto';
import { GetOrdersForExportDto } from './dto/get-orders-for-export.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

export default class OrderAPI {
  static async create(createOrderDto: CreateOrderDto): Promise<{
    order: IOrder;
    finishedProducts: IFinishedProduct[];
  }> {
    const { data } = await $authHost.post('orders', createOrderDto);
    return data;
  }

  static async getAll(
    getOrdersDto?: GetOrdersDto,
    signal?: AbortSignal
  ): Promise<IOrderData> {
    const { data } = await $authHost.get('orders', {
      params: getOrdersDto,
      signal,
    });
    return data;
  }

  static async getAllForExport(
    getOrdersForExportDto?: GetOrdersForExportDto,
    signal?: AbortSignal
  ): Promise<IOrder[]> {
    const { data } = await $authHost.get('orders/export', {
      params: getOrdersForExportDto,
      signal,
    });
    return data;
  }

  static async getOne(orderId: number): Promise<IOrder> {
    const { data } = await $authHost.get(`orders/one/${orderId}`);
    return data;
  }

  static async editShop(
    editOrderShopDto?: EditOrderShopDto
  ): Promise<[number]> {
    const { data } = await $authHost.put('orders/shop', editOrderShopDto);
    return data;
  }

  static async editStatus(
    editOrderStatusDto?: EditOrderStatusDto
  ): Promise<[number]> {
    const { data } = await $authHost.put('orders/status', editOrderStatusDto);
    return data;
  }
}
