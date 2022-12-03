/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Carts } from './carts.entity'

@Entity()
export class CartItems {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column('uuid')
  public product_id: string

  @Column('integer')
  public count: string

  @ManyToOne(() => Carts, (cart) => cart.cart_items)
  cart: Carts
}