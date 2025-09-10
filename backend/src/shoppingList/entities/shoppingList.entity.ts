import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ShoppingListItem } from "./shoppingListItem.entity";

@Entity({})
export class ShoppingList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "date",
        nullable: false,
        unique: true
    })
    @Index()
    startDate: Date;

    @Column({
        type: "date",
        nullable: false,
        unique: true
    })
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.shoppingList, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => ShoppingListItem, (shoppingListItem) => shoppingListItem.shoppingList, {
        onDelete: "CASCADE",
    })
    shoppingListItem: ShoppingListItem[];
}
