import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ShoppingListItem } from "./shoppingListItem.entity";

@Entity({})
export class ShoppingList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "date",
        nullable: false,
    })
    startDate: Date;

    @Column({
        type: "date",
        nullable: false,
    })
    endDate: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

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
