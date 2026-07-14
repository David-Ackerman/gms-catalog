import { Field, InputType } from "type-graphql";

@InputType()
export class GameListFilterInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  developer?: string;

  @Field(() => String, { nullable: true })
  genres?: string;

  @Field(() => String, { nullable: true })
  sortBy?: "averageScore" | "releaseDate" | "createdAt";

  @Field(() => String, { nullable: true })
  order?: "asc" | "desc";

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Boolean, { nullable: true })
  includeInactive?: boolean;
}

@InputType()
export class CreateGameInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String, { nullable: true })
  synopsis?: string;

  @Field(() => String, { nullable: true })
  developer?: string;

  @Field(() => String, { nullable: true })
  publisher?: string;

  @Field(() => Date, { nullable: true })
  releaseDate?: Date;

  @Field(() => String, { nullable: true })
  genres?: string;

  @Field(() => String, { nullable: true })
  platforms?: string;

  @Field(() => String, { nullable: true })
  coverUrl?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateGameInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  synopsis?: string;

  @Field(() => String, { nullable: true })
  developer?: string;

  @Field(() => String, { nullable: true })
  publisher?: string;

  @Field(() => Date, { nullable: true })
  releaseDate?: Date;

  @Field(() => String, { nullable: true })
  genres?: string;

  @Field(() => String, { nullable: true })
  platforms?: string;

  @Field(() => String, { nullable: true })
  coverUrl?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
