import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItems } from './cart-items.entity';

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public user_id: string;

  @Column({
    type: 'date',
    default: '2022-10-19'
  })
  public created_at?: string;

  @Column({
    type: 'date',
    default: '2022-10-19'
  })
  public updated_at?: string;


  @OneToMany(() => CartItems, (cart_item) => cart_item.cart)
  cart_items: CartItems[]
}