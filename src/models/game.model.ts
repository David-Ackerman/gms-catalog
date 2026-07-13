import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";

@ObjectType()
export class GameModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String, { nullable: true })
  synopsis?: string | null;

  @Field(() => String, { nullable: true })
  developer?: string | null;

  @Field(() => String, { nullable: true })
  publisher?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  releaseDate?: Date | null;

  @Field(() => String, { nullable: true })
  genres?: string | null;

  @Field(() => String, { nullable: true })
  platforms?: string | null;

  @Field(() => String, { nullable: true })
  coverUrl?: string | null;

  @Field(() => Number, { nullable: true })
  averageScore?: number | null;

  @Field(() => Number, { nullable: true })
  reviewCount?: number | null;

  @Field(() => Number, { nullable: true })
  playedCount?: number | null;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
