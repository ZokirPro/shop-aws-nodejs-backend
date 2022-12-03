import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from '../models'
import { Repository } from 'typeorm';
import { toISO } from '../../utils/iso-date.util';
import { Carts } from 'src/db/entities/carts.entity';

@Injectable()
export class CartService {
  public constructor(@InjectRepository(Carts) private readonly repo: Repository<Carts>) { }

  async getAllCartsList() {
    try {
      console.log("getAllCartsList service method invoked")
      // await this.seed()
      return await this.repo.find({
        relations: {
          cart_items: true
        }
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async findByUserId(userId: string) {
    try {
      return await this.repo.findOneBy({
        user_id: userId
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createByUserId(userId: string) {
    try {
      const id = v4(v4());
      const userCart = {
        id,
        user_id: userId,
        created_at: toISO(new Date()),
        updated_at: toISO(new Date()),
      };
      await this.repo.create(userCart);
      return userCart;
    } catch (e) {
      return false;
    }
  }

  async findOrCreateByUserId(userId: string) {
    try {
      const userCart = await this.findByUserId(userId);
      if (userCart) {
        return userCart;
      }
      return await this.createByUserId(userId);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateByUserId(userId: string, { items: items }: CartModel) {
    try {
      const cart = await this.findOrCreateByUserId(userId);
      if (cart) {
        const updatedCart = {
          id: cart.id,
          items: [...items],
        }
        await this.repo.update({
          user_id: userId
        }, updatedCart);
        return updatedCart;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async removeByUserId(userId) {
    try {
      const cart = await this.findByUserId(userId);
      if (cart) {
        await this.repo.remove([cart]);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async seed() {
    this.repo.query(`
INSERT INTO public.users (id,name, email, password) values
    ('8e6f31c0-730d-11ed-a1eb-0242ac120002','zokir', 'zokir@gmail.com', 'TEST_PASSWORD'),
    ('8e6f3580-730d-11ed-a1eb-0242ac120002','test', 'test@example.com', 'test');

INSERT INTO public.carts (id, user_id, created_at, updated_at) values
('8e6f3738-730d-11ed-a1eb-0242ac120002','8e6f31c0-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f39ae-730d-11ed-a1eb-0242ac120002','8e6f31c0-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f3ada-730d-11ed-a1eb-0242ac120002','8e6f3580-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f3ea4-730d-11ed-a1eb-0242ac120002','8e6f3580-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19');

INSERT INTO public.cart_items (cart_id, product_id, count) values
('8e6f3738-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2),
('8e6f39ae-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2),
('8e6f3ada-730d-11ed-a1eb-0242ac120002', 'cb829089-e5fe-4c75-8cb0-d2039e27cba7', 1),
('8e6f3ea4-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2);
    `)
  }
}
