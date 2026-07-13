import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { GameModel } from "@/models/game.model";

@ObjectType()
export class PlayedGameModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  gameId!: string;

  @Field(() => String)
  status!: string;

  @Field(() => Number, { nullable: true })
  personalScore?: number | null;

  @Field(() => String, { nullable: true })
  reviewNote?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => GameModel, { nullable: true })
  game?: GameModel | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
